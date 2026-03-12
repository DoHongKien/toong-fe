import { ChevronDown } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FadeIn from '../components/FadeIn'

const passCards = [
  {
    id: 'trial',
    headerClass: 'bg-dark-green',
    title: 'TRIAL',
    titleSub: 'pass',
    validity: 'HẠN THẺ 31.12.2025',
    price: '8,990,000 VNĐ',
    features: [{ text: '3 cung đường', bold: true }, { text: '1 Chủ sở hữu', bold: true }],
    isSignature: false,
    delay: '0ms',
  },
  {
    id: 'sharing',
    headerClass: 'bg-orange',
    title: 'SHARING',
    titleSub: 'pass',
    validity: 'HẠN THẺ 31.12.2025',
    price: '17,990,000 VNĐ',
    features: [{ text: '6 cung đường', bold: true }, { text: 'Tối đa 3 chủ sở hữu', bold: true }],
    isSignature: false,
    delay: '100ms',
  },
  {
    id: 'adventure',
    headerClass: 'bg-black',
    title: 'ADVENTURE',
    titleSub: 'pass',
    validity: null,
    price: '37,900,000 VNĐ',
    features: [
      { text: '10 cung đường', bold: true },
      { text: '1 Chủ sở hữu', bold: true },
      {
        text: 'Đặc quyền thẻ phụ: Mời bạn bè đi chung tour Tổ Ong Adventure 2 lần miễn phí',
        bold: false,
      },
      {
        text: '5 bộ môn thể thao mạo hiểm',
        bold: false,
        subList: [
          'Hiking - trekking (10 chuyến)',
          'Lặn biển bình khí (1 vé)',
          'Đu dây vượt thác (1 vé)',
          'Chèo SUP (1 vé)',
          'Trượt zipline mạo hiểm (1 vé)',
        ],
      },
    ],
    isSignature: true,
    delay: '200ms',
  },
]

const AdventurePass = () => {
  const handleChoosePass = (passId) => {
    // Choose pass action
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero pass-hero">
        <div className="hero-overlay" style={{ background: 'none' }}></div>
        <div className="hero-content container fade-in-up">
          <h1 className="hero-title pass-hero-title">
            ONE PAY
            <br />
            ONE ADVENTURE YEAR
          </h1>
        </div>
        <div className="scroll-down" aria-hidden="true">
          <ChevronDown />
        </div>
      </section>

      {/* Intro Section */}
      <section className="section pass-intro bg-white" id="intro">
        <div className="container text-center">
          <FadeIn>
            <h2 className="pass-intro-title">
              Khám phá <span className="text-orange">"Adventure Year"</span>
              <br />
              trong mỗi Nhà Chinh Phục
            </h2>
          </FadeIn>
          <FadeIn className="pass-intro-text">
            <p>
              "Adventure" - Cảm giác phiêu lưu trong mỗi Nhà Chinh Phục đều có một định nghĩa riêng! Đối với bạn, một
              năm phiêu lưu "cực đã" sẽ như thế nào? - Đơn giản là đôi ba chuyến "tắm rừng" chữa lành, những hành
              trình không internet để kết nối với nhau, hay nhiều hơn thế?
            </p>
            <p>
              Bắt đầu một năm phiêu lưu bùng nổ xúc cảm với đa dạng bộ môn thể thao cùng One Pay, One Adventure Year
              thôi nào! Mỗi dòng thẻ đều được thiết kế để tạo nên một năm "Yeah Cực Đã" cho các Nhà Chinh Phục.
            </p>
            <ul className="pass-intro-list">
              <li>Không giới hạn trong loại hình hiking, trekking!</li>
              <li>Không giới hạn trong từng cấp độ cung đường!</li>
              <li>Không chỉ là một chiếc thẻ!</li>
            </ul>
            <p>
              <strong>
                One Pay, One Adventure Year khởi trải nghiệm, bùng cảm xúc, cùng bạn ký danh một năm chinh phục "Cực
                Đã"
              </strong>
            </p>
          </FadeIn>

          <FadeIn className="pass-concept-graphics">
            <div className="concept-item">
              <img
                className="img-fluid"
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=600&q=80"
                alt="Check-in thẻ"
                style={{ borderRadius: 20 }}
              />
              <h3>
                Check-in cùng thẻ - Ghi dấu một năm
                <br />
                <span className="text-orange" style={{ fontSize: '2.5rem', fontStyle: 'italic' }}>
                  YEAH CỰC ĐÃ!
                </span>
              </h3>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Concept Section */}
      <section className="section pass-concept bg-grey">
        <div className="container text-center">
          <FadeIn>
            <h3 className="mt-5">
              Tạo nên playlist Spotify phiêu lưu
              <br />
              <span className="text-orange" style={{ fontSize: '2.5rem', fontStyle: 'italic' }}>
                CỦA RIÊNG BẠN
              </span>
            </h3>
          </FadeIn>
        </div>
      </section>

      {/* Pass Cards Section */}
      <section className="section pass-cards" id="passes">
        <div className="container">
          <div className="pass-grid">
            {passCards.map((card) => (
              <FadeIn key={card.id} style={{ transitionDelay: card.delay }}>
                <div className="pass-card">
                  <div className={`pass-card-header ${card.headerClass}`}>
                    <img
                      src="https://toongadventure.com/wp-content/uploads/2023/12/logo-white.svg"
                      alt="Logo"
                      className="pass-logo"
                      onError={(e) => {
                        e.currentTarget.src = ''
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <h3>
                      {card.title}
                      <br />
                      <em>{card.titleSub}</em>
                    </h3>
                    {card.validity && <p className="pass-validity">{card.validity}</p>}
                    {card.isSignature && <div className="signature-badge">Phiên bản giới hạn</div>}
                  </div>
                  <div className="pass-card-body">
                    <div className="pass-price">{card.price}</div>
                    <ul className="pass-features">
                      {card.features.map((feature, i) => (
                        <li key={i}>
                          {feature.bold ? <strong>{feature.text}</strong> : feature.text}
                          {feature.subList && (
                            <ul style={{ listStyle: 'circle', paddingLeft: 20, color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
                              {feature.subList.map((sub) => (
                                <li key={sub}>{sub}</li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                    <button
                      className="btn pass-btn w-100"
                      onClick={() => handleChoosePass(card.id)}
                      aria-label={`Chọn ${card.title} pass`}
                    >
                      Chọn thẻ
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Slogan */}
      <section className="section pass-slogan text-center bg-white">
        <div className="container">
          <FadeIn>
            <h2>
              YOUR <span className="text-orange">WILD SPIRIT</span>.
              <br />
              OUR <span className="text-orange">EXPERT KNOWLEDGE</span>.
              <br />
              <span className="text-orange">UNIQUE</span> ADVENTURE.
            </h2>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </>
  )
}

export default AdventurePass
