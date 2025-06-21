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
              이곳은 저작권이 만료된 퍼블릭 도메인 번역본이나 해석본을 누구나 쉽게 접할 수 있도록 제공하는 프로젝트입니다.<br/>
              AI 번역의 한계로 인해 학술적 정확성보다는 잘 알려지지 않은 역사 원전에 대한 대중의 접근성을 높이는 데 더 큰 목표를 두고 있습니다.<br/>
              국내에 출판되지 않은 작품을 위주로 다루지만 이미 출판된 작품이 포함되기도 합니다.
            </p>
          </section>

          <section>
            <h2>콘텐츠에 대하여</h2>
            <p>
              이곳의 모든 콘텐츠는 판본을 OCR로 인식하고 AI를 통해 번역한 결과물로 교양이나 취미를 위한 자료로 활용하시는 것을 권장합니다.<br/>
              정확한 학술 연구나 인용이 필요하신 경우 제공되는 원문 링크나 출판된 서적을 반드시 확인해 주시기 바랍니다.
            </p>
          </section>

          <section>
            <h2>의견 및 제보</h2>
            <p>
              저작권 문제를 발견하셨거나, 프로젝트의 취지에 맞는 새로운 번역 자료를 제안하고 싶으시다면 아래 버튼으로 문의해 주세요.<br/>
              보내주신 소중한 의견은 주기적으로 확인하여 더 나은 사이트를 만드는 데 적극 반영하겠습니다.<br/>
              다만 모든 콘텐츠가 OCR과 AI 번역을 기반으로 하는 만큼 사소한 오역이나 오탈자에 대한 수정 제보까지 반영하기는 어려운 점 양해 바랍니다.
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