import React from 'react';

const AboutPage = () => {
  const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSd25H2TfVQEyMeo2nUr2vnECjsHK4LqyHr-AeSy4CLw2vzoAw/viewform?usp=header";

  return (
    <div className="page-wrapper">
      <main className="main-content">
        <div className="about-page-container">
          <section>
            <h2>프로젝트 소개</h2>
            <p>
              본 프로젝트는 저작권 보호 기간이 만료된 퍼블릭 도메인 번역본이나 해석본을 누구나 쉽게 접할 수 있도록 마련되었습니다.<br/>
              AI번역을 통한 불완전한 결과물을 제공하기 때문에 학술적 목적보다는 역사 원전에 대한 대중의 접근성을 높이는 데 목표를 두고 있습니다.<br/>
              주로 국내에 출판되지 않은 작품을 다루는 것을 목표로 하지만 출판된 작품이 포함될 수도 있습니다.
            </p>
          </section>

          <section>
            <h2>콘텐츠에 대하여</h2>
            <p>
              이곳의 모든 콘텐츠는 원전에 대한 편집본을 OCR로 인식하고 AI를 통해 번역한 결과물로 교양, 취미활동을 위한 참고 자료로만 활용해 주시길 바랍니다.<br/>
              정확한 학술 연구나 인용이 필요하신 경우 제공되는 원문 링크나 출판된 서적을 확인하실 것을 강력히 권장합니다.
            </p>
          </section>

          <section>
            <h2>의견 및 제보</h2>
            <p>
              저작권 관련 문제를 발견하셨거나 프로젝트의 취지에 맞는 자료의 번역을 제안하고 싶으시면 아래 버튼을 통해 문의가 가능합니다.<br/>
              보내주신 소중한 의견은 주기적으로 확인하여 더 나은 사이트를 만드는 데 적극 반영하겠습니다.<br/>
              다만, 모든 콘텐츠는 OCR과 AI 번역을 기반으로 하므로 사소한 오역이나 오탈자에 대한 수정 제보는 받기 어려운 점 양해 부탁드립니다.
            </p>
            <a 
              href={googleFormUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="feedback-button"
            >
              의견 보내기
            </a>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;