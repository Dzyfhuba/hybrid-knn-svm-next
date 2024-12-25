import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

class LinearSVM {
    lr: number
    C: number
    n_iters: number
    w: tf.Tensor | null
    b: tf.Tensor | null
    loss_history: number[]

    constructor(learning_rate = 0.001, regularization_param = 1.0, n_iters = 1000) {
        this.lr = learning_rate
        this.C = regularization_param
        this.n_iters = n_iters
        this.w = null
        this.b = null
        this.loss_history = []
    }

    async fit(X: tf.Tensor, y: tf.Tensor) {
        const [n_samples, n_features] = X.shape
        const y_ = y.where(y.lessEqual(0), tf.scalar(-1)).where(y.greater(0), tf.scalar(1))

        this.w = tf.zeros([n_features])
        this.b = tf.scalar(0)

        for (let epoch = 0; epoch < this.n_iters; epoch++) {
            for (let idx = 0; idx < n_samples; idx++) {
                const x_i = X.slice([idx, 0], [1, n_features])
                const y_i = y_.slice([idx], [1])
                const condition = y_i.mul(x_i.dot(this.w).add(this.b)).greaterEqual(1)

                if (condition.arraySync()) {
                    // this.w = this.w.sub(this.lr * (this.w.div(n_samples).mul(2)))
                    this.w = this.w.sub(this.w.div(n_samples).mul(2).mul(tf.scalar(this.lr)))

                } else {
                    // this.w = this.w.sub(this.lr * (this.w.div(n_samples).mul(2).sub(x_i.mul(y_i).mul(this.C))))
                    this.w = this.w.sub(tf.scalar(this.lr).mul(this.w.div(n_samples).mul(2).sub(x_i.mul(y_i)).mul(this.C)))

                    // this.b = this.b.add(this.lr * y_i.mul(this.C))
                    this.b = this.b.add(tf.scalar(this.lr).mul(y_i).mul(tf.scalar(this.C)))

                }
            }

            const loss = await this._compute_loss(X, y_)
            this.loss_history.push(loss)
            if (epoch % 1000 === 0) {
                console.log(`Epoch ${epoch}, Loss: ${loss}`)
            }
        }

        console.log(`Training complete. Final Loss: ${this.loss_history[this.loss_history.length - 1]}`)
    }

    async _compute_loss(X: tf.Tensor, y: tf.Tensor) {
        if (this.w === null || this.b === null) {
            throw new Error("Model parameters are not initialized.")
        }
        const margin_losses = tf.maximum(tf.scalar(0), tf.scalar(0.1).sub(y.mul(X.dot(this.w).add(this.b))))
        const regularization = tf.scalar(0.5).mul(this.w.dot(this.w))
        const loss = regularization.add(tf.scalar(this.C).mul(margin_losses.sum()))
        return loss.dataSync()[0]
    }

    decision_function(X: tf.Tensor) {
        return X.dot(this.w!).add(this.b!)
    }

    predict(X: tf.Tensor) {
        return this.decision_function(X).sign()
    }

    plot_loss_history() {
        // const series = { values: this.loss_history.map((loss, epoch) => ({ x: epoch, y: loss })) }
        // tfvis.render.linechart({ name: 'Loss History' }, { values: [series] }, { xLabel: 'Epoch', yLabel: 'Loss' })
    }
}

class MultiClassSVM {
    lr: number
    C: number
    n_iters: number
    models: LinearSVM[]
    classes: tf.Tensor1D | null

    constructor(learning_rate = 0.001, regularization_param = 1.0, n_iters = 1000) {
        this.lr = learning_rate
        this.C = regularization_param
        this.n_iters = n_iters
        this.models = []
        this.classes = null
    }

    async fit(X: tf.Tensor, y: tf.Tensor) {
        this.classes = y.unique()
        const classesArray = await this.classes.array()

        for (const cls of classesArray) {
            const y_binary = y.equal(cls).where(y.notEqual(cls), tf.scalar(-1))
            console.log(`Training class ${cls} vs all`)
            const model = new LinearSVM(this.lr, this.C, this.n_iters)
            await model.fit(X, y_binary)
            this.models.push(model)
        }
    }

    async predict(X: tf.Tensor) {
        const decision_values = await Promise.all(this.models.map(model => model.decision_function(X).array()))
        const decisionTensor = tf.tensor(decision_values)
        const predictions = decisionTensor.argMax(0)
        return this.classes.gather(predictions)
    }

    async print_weights_and_biases() {
        for (let i = 0; i < this.models.length; i++) {
            const model = this.models[i]
            const weights = await model.w.array()
            const bias = await model.b.array()
            console.log(`Class ${this.classes.arraySync()[i]}:`)
            console.log(`  Weights: ${weights}`)
            console.log(`  Bias: ${bias}`)
        }
    }

    plot_loss_history() {
        this.models.forEach((model, i) => {
            const series = { values: model.loss_history.map((loss, epoch) => ({ x: epoch, y: loss })) }
            tfvis.render.linechart({ name: `Loss History - Class ${this.classes.arraySync()[i]}` }, { values: [series] }, { xLabel: 'Epoch', yLabel: 'Loss' })
        })
    }
}

export { LinearSVM, MultiClassSVM }