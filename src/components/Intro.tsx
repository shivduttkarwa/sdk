import { useIntroHeading } from '@/hooks/useIntroHeading';
import { useIntroBody } from '@/hooks/useIntroBody';

export default function Intro() {
  useIntroHeading();
  useIntroBody();
  return (
    <section className="sdk-intro" id="intro">
      <div className="sdk-intro__inner">
        <div className="sdk-intro__header">
          <span className="sdk-eyebrow">About</span>
          <h2 className="sdk-intro__heading">
            <span className="sdk-intro__char-wrap"></span>
          </h2>
        </div>
        <p className="sdk-intro__body">
          I was drawn to a world where{' '}
          <em className="sdk-intro__highlight">design meets engineering</em> — a space where I can
          imagine, build and <em className="sdk-intro__highlight">ship anything.</em> That's what
          makes me a full&#8209;stack developer.
        </p>
      </div>
    </section>
  );
}
