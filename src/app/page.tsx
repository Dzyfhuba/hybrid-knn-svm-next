import Cleaning from '@/components/Cleaning';
import Client from '@/components/Client';
import Normalisasi from '@/components/Normalisasi';
import dynamic from 'next/dynamic';
import DatatableSkeleton from '@/components/DatatableSkeleton';
import SvmCalc from '@/components/SvmCalc';
import SectionContainer from '@/components/SectionContainer';
import Footer from '@/components/Footer';

const SkelData = dynamic(() => import('@/components/Data'), {
  ssr: false,
  loading: () => <div className="skeleton h-full w-full"></div>,
});

export default async function Home() {
  return (
    <Client>
      <div className="h-screen">
        <div className="carousel carousel-vertical h-full w-full">
          <div className="carousel-item h-full ">
            <SectionContainer name="datamentah">
              <SkelData />
            </SectionContainer>
          </div>
          <div className="carousel-item h-full ">
            <SectionContainer name="cleaning">
              <Cleaning />
            </SectionContainer>
          </div>
          <div className="carousel-item h-full ">
            <SectionContainer name="normalisasidata">
              <Normalisasi />
            </SectionContainer>
          </div>
          <div className="carousel-item h-full ">
            <SectionContainer name="svm">
              <SvmCalc />
            </SectionContainer>
          </div>
          <div className="carousel-item h-full ">
            <SectionContainer name="knn">
              <p>KNN</p>
            </SectionContainer>
          </div>
          <div className="carousel-item h-full ">
            <SectionContainer name="confusingmatrix">
              <p>confusingmatrix</p>
            </SectionContainer>
          </div>
        </div>
      </div>
      <Footer />
    </Client>
  );

  return (
    <>
      <Client>
        <SkelData />
        <Cleaning />
        <Normalisasi />

        <h1 className="text-center text-xl font-medium mb-3">SVM</h1>
        <SvmCalc />
        {/* <DatatableSkeleton />*/}

        <section id="knn">
          <h1 className="text-center text-xl font-medium mb-3">KNN</h1>

          <DatatableSkeleton />
        </section>

        <section id="confusingmatrix">
          <h1 className="text-center text-xl font-medium mb-3">
            CONFUSING MATRIX
          </h1>

          <DatatableSkeleton />
        </section>
      </Client>
    </>
  );
}
