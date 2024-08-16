
type stepsDataProcessItemType = {
    idName: "datamentah" | 'cleaning' | 'normalisasidata' | 'svm' | 'knn' | 'confusingmatrix'
    order: number
}
type stepsDataProcessType = {
    datamentah: stepsDataProcessItemType
    cleaning: stepsDataProcessItemType
    normalisasidata: stepsDataProcessItemType
    svm: stepsDataProcessItemType
    knn: stepsDataProcessItemType
    confusingmatrix: stepsDataProcessItemType
}


const stepsDataProcess: stepsDataProcessType = {
    datamentah: {
        idName: 'datamentah',
        order: 1,
    },
    cleaning: {
        idName: 'cleaning',
        order: 2
    },
    normalisasidata: {
        idName: 'normalisasidata',
        order: 3,
    },
    svm: {
        idName: 'svm',
        order: 4
    },
    knn: {
        idName: 'knn',
        order: 5
    },
    confusingmatrix: {
        idName: 'confusingmatrix',
        order: 6
    }
}


export default stepsDataProcess
