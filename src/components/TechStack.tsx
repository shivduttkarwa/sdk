import type { CSSProperties } from 'react';

import { useTechStackPin } from '@/hooks/useTechStackPin';

export default function TechStack() {
  useTechStackPin();
  return (
    <section id="services" className="sdk-stack-section">
      <div className="sdk-stack__inner">
        <div className="sdk-tech-pin" data-tech-pin>
          <div className="sdk-tech-pin__sticky">
            <div className="sdk-tech-pin__intro" data-tech-intro>
              <span className="sdk-eyebrow">Capabilities</span>
              <h2 className="sdk-stack__title">
                <span className="sdk-stack__title-line" data-split>
                  My Tech
                </span>
                <span className="sdk-stack__title-line sdk-stack__title-dim" data-split>
                  Stack
                </span>
              </h2>
              <p className="sdk-stack__subtitle">
                A refined toolkit for building fast, accessible, and premium digital products.
              </p>
            </div>
            <div className="sdk-tech-pin__portrait" aria-hidden="true">
              <img src="shiv-big.png" alt="" className="sdk-tech-pin__image" data-tech-pin-image />
            </div>
          </div>

          <div className="sdk-tech-pin__cards">
            <div className="sdk-tech-card-layer services_home_bottom_sticky_wrap u-cover-absolute is-first u-pointer-off">
              <div className="sdk-tech-card-layer__inner services_home_bottom_sticky_inner u-position-sticky u-min-height-screen u-flex-vertical-nowrap u-justify-content-center u-align-items-center">
                <div className="sdk-tech-card-cms services_home_cards_cms_list_wrapper is-first w-dyn-list">
                  <div
                    role="list"
                    className="sdk-tech-card-list services_home_cards_cms_list w-dyn-items"
                  >
                    <div
                      role="listitem"
                      className="sdk-tech-card-item services_home_cards_cms_item w-dyn-item"
                    >
                      <article
                        className="sdk-tech-card services_home_card_wrap u-flex-vertical-nowrap u-justify-content-between u-pointer-on u-width-full"
                        data-tech-stack-card
                        data-service-card=""
                      >
                        <div className="sdk-tech-card__top">
                          <span>01</span>
                          <span>Interface</span>
                        </div>
                        <div>
                          <h3>Frontend Engineering</h3>
                          <p>
                            Polished UI systems with sharp interaction, responsive layouts, and
                            motion that supports the experience.
                          </p>
                        </div>
                        <div className="sdk-tech-card__bottom">
                          <div className="sdk-tech-card__tags">
                            <span>React</span>
                            <span>Next.js</span>
                            <span>TypeScript</span>
                            <span>Tailwind CSS</span>
                            <span>GSAP</span>
                            <span>Three.js</span>
                          </div>
                          <strong>01</strong>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sdk-tech-card-layer services_home_bottom_sticky_wrap u-cover-absolute is-second u-pointer-off">
              <div className="sdk-tech-card-layer__inner services_home_bottom_sticky_inner u-position-sticky u-min-height-screen u-flex-vertical-nowrap u-justify-content-center u-align-items-center">
                <div className="sdk-tech-card-cms services_home_cards_cms_list_wrapper is-second w-dyn-list">
                  <div
                    role="list"
                    className="sdk-tech-card-list services_home_cards_cms_list w-dyn-items"
                  >
                    <div
                      role="listitem"
                      className="sdk-tech-card-item services_home_cards_cms_item w-dyn-item"
                    >
                      <article
                        className="sdk-tech-card services_home_card_wrap u-flex-vertical-nowrap u-justify-content-between u-pointer-on u-width-full"
                        data-tech-stack-card
                        data-service-card=""
                      >
                        <div className="sdk-tech-card__top">
                          <span>02</span>
                          <span>Systems</span>
                        </div>
                        <div>
                          <h3>Backend &amp; API</h3>
                          <p>
                            Reliable server logic, clean API contracts, auth flows, and data
                            handling built to scale beyond the demo.
                          </p>
                        </div>
                        <div className="sdk-tech-card__bottom">
                          <div className="sdk-tech-card__tags">
                            <span>Node.js</span>
                            <span>Express</span>
                            <span>Python</span>
                            <span>Django</span>
                            <span>REST API</span>
                            <span>Auth</span>
                          </div>
                          <strong>02</strong>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sdk-tech-card-layer services_home_bottom_sticky_wrap u-cover-absolute is-third u-pointer-off">
              <div className="sdk-tech-card-layer__inner services_home_bottom_sticky_inner u-position-sticky u-min-height-screen u-flex-vertical-nowrap u-justify-content-center u-align-items-center">
                <div className="sdk-tech-card-cms services_home_cards_cms_list_wrapper is-third w-dyn-list">
                  <div
                    role="list"
                    className="sdk-tech-card-list services_home_cards_cms_list w-dyn-items"
                  >
                    <div
                      role="listitem"
                      className="sdk-tech-card-item services_home_cards_cms_item w-dyn-item"
                    >
                      <article
                        className="sdk-tech-card services_home_card_wrap u-flex-vertical-nowrap u-justify-content-between u-pointer-on u-width-full"
                        data-tech-stack-card
                        data-service-card=""
                      >
                        <div className="sdk-tech-card__top">
                          <span>03</span>
                          <span>Data</span>
                        </div>
                        <div>
                          <h3>Database Layer</h3>
                          <p>
                            Structured storage, realtime data, dashboards, and product foundations
                            that keep the application steady.
                          </p>
                        </div>
                        <div className="sdk-tech-card__bottom">
                          <div className="sdk-tech-card__tags">
                            <span>PostgreSQL</span>
                            <span>MongoDB</span>
                            <span>Firebase</span>
                            <span>Supabase</span>
                            <span>Prisma</span>
                          </div>
                          <strong>03</strong>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sdk-tech-card-layer services_home_bottom_sticky_wrap u-cover-absolute is-fourth u-pointer-off">
              <div className="sdk-tech-card-layer__inner services_home_bottom_sticky_inner u-position-sticky u-min-height-screen u-flex-vertical-nowrap u-justify-content-center u-align-items-center">
                <div className="sdk-tech-card-cms services_home_cards_cms_list_wrapper is-fourth w-dyn-list">
                  <div
                    role="list"
                    className="sdk-tech-card-list services_home_cards_cms_list w-dyn-items"
                  >
                    <div
                      role="listitem"
                      className="sdk-tech-card-item services_home_cards_cms_item w-dyn-item"
                    >
                      <article
                        className="sdk-tech-card services_home_card_wrap u-flex-vertical-nowrap u-justify-content-between u-pointer-on u-width-full"
                        data-tech-stack-card
                        data-service-card=""
                      >
                        <div className="sdk-tech-card__top">
                          <span>04</span>
                          <span>Delivery</span>
                        </div>
                        <div>
                          <h3>DevOps &amp; Tools</h3>
                          <p>
                            Version control, deployment, collaboration, and automation workflows
                            that move work from idea to live product.
                          </p>
                        </div>
                        <div className="sdk-tech-card__bottom">
                          <div className="sdk-tech-card__tags">
                            <span>Git</span>
                            <span>Docker</span>
                            <span>AWS</span>
                            <span>Vercel</span>
                            <span>Figma</span>
                            <span>GitHub Actions</span>
                          </div>
                          <strong>04</strong>
                        </div>
                      </article>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sdk-tech-pin__steps" aria-hidden="true">
            <span
              className="sdk-tech-pin__step"
              data-tech-step
              style={{ '--step': 0 } as CSSProperties}
            ></span>
            <span
              className="sdk-tech-pin__step"
              data-tech-step
              style={{ '--step': 1 } as CSSProperties}
            ></span>
            <span
              className="sdk-tech-pin__step"
              data-tech-step
              style={{ '--step': 2 } as CSSProperties}
            ></span>
            <span
              className="sdk-tech-pin__step"
              data-tech-step
              style={{ '--step': 3 } as CSSProperties}
            ></span>
          </div>
        </div>
      </div>
    </section>
  );
}
