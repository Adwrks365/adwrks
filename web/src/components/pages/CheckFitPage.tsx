"use client";

import Image from "next/image";
import { useCallback, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import {
  CHECK_FIT_FILTERED_INDUSTRIES,
  CHECK_FIT_FILTERED_RESULT,
  CHECK_FIT_HERO,
  CHECK_FIT_PRIVACY,
  CHECK_FIT_QUESTIONS,
  CHECK_FIT_TRUST_LINES,
  buildCheckFitWhatsappUrl,
  computeCheckFitResult,
  type CheckFitResult,
} from "@/lib/pages/check-fit-data";
import { SITE } from "@/lib/site";

type Screen = "hero" | "quiz" | "success";

/** Multi-step fit assessment quiz — ported from legacy WordPress /check-fit/ page. */
export function CheckFitPage({ locale: _locale = "he" }: import("@/lib/locale-props").LocaleProps) {
  const [screen, setScreen] = useState<Screen>("hero");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<CheckFitResult | null>(null);

  const progressPercent = useMemo(() => {
    if (screen !== "quiz") return 0;
    return Math.round((currentQuestion / CHECK_FIT_QUESTIONS.length) * 100);
  }, [screen, currentQuestion]);

  const whatsappUrl = useMemo(
    () => (answers.length > 0 ? buildCheckFitWhatsappUrl(answers) : ""),
    [answers],
  );

  const startQuiz = useCallback(() => {
    setScreen("quiz");
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
  }, []);

  const showResult = useCallback((next: CheckFitResult) => {
    setResult(next);
    setScreen("success");
  }, []);

  const handleAnswer = useCallback(
    (option: string) => {
      const nextAnswers = [...answers, option];

      if (currentQuestion === 1 && CHECK_FIT_FILTERED_INDUSTRIES.has(option)) {
        setAnswers(nextAnswers);
        showResult(CHECK_FIT_FILTERED_RESULT);
        return;
      }

      if (currentQuestion < CHECK_FIT_QUESTIONS.length - 1) {
        setAnswers(nextAnswers);
        setCurrentQuestion((prev) => prev + 1);
        return;
      }

      setAnswers(nextAnswers);
      showResult(computeCheckFitResult(nextAnswers));
    },
    [answers, currentQuestion, showResult],
  );

  const goBack = useCallback(() => {
    if (currentQuestion === 0) {
      setScreen("hero");
      setAnswers([]);
      return;
    }

    setAnswers((prev) => prev.slice(0, -1));
    setCurrentQuestion((prev) => prev - 1);
  }, [currentQuestion]);

  const goBackFromSuccess = useCallback(() => {
    const nextAnswers = answers.slice(0, -1);
    setScreen("quiz");
    setResult(null);
    setAnswers(nextAnswers);
    setCurrentQuestion(Math.min(nextAnswers.length, CHECK_FIT_QUESTIONS.length - 1));
  }, [answers]);

  const question = CHECK_FIT_QUESTIONS[currentQuestion];

  return (
    <article className="check-fit-page">
      <Container className="check-fit-shell">
        <div className="check-fit-card" dir="rtl">
          {screen === "hero" ? (
            <section className="check-fit-hero" aria-label="פתיחת בדיקת התאמה">
              <div className="check-fit-logo">
                <Image
                  src={SITE.logoFull}
                  alt="Adwrks"
                  width={180}
                  height={60}
                  className="check-fit-logo-img"
                />
              </div>

              <h1 className="check-fit-title">
                {CHECK_FIT_HERO.titleLine1}
                <br />
                <span className="check-fit-title-highlight">{CHECK_FIT_HERO.titleHighlight}</span>
              </h1>

              <p className="check-fit-subtitle">
                {CHECK_FIT_HERO.subtitle[0]}
                <br />
                {CHECK_FIT_HERO.subtitle[1]}
              </p>

              <div className="check-fit-badges">
                {CHECK_FIT_HERO.badges.map((badge) => (
                  <span key={badge} className="check-fit-badge">
                    {badge}
                  </span>
                ))}
              </div>

              <button type="button" className="check-fit-main-btn" onClick={startQuiz}>
                {CHECK_FIT_HERO.cta}
              </button>
            </section>
          ) : null}

          {screen === "quiz" && question ? (
            <section className="check-fit-quiz" aria-label="שאלון בדיקת התאמה">
              <div className="check-fit-progress" aria-hidden="true">
                <div
                  className="check-fit-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <h2 className="check-fit-question-title">{question.title}</h2>

              <div className="check-fit-options">
                {question.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="check-fit-option"
                    onClick={() => handleAnswer(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <button type="button" className="check-fit-back-btn" onClick={goBack}>
                ← חזור לשלב הקודם
              </button>
            </section>
          ) : null}

          {screen === "success" && result ? (
            <section className="check-fit-success" aria-label="תוצאת בדיקת התאמה">
              <div className="check-fit-success-icon" aria-hidden="true">
                {result.icon}
              </div>

              <h2 className="check-fit-result-title">{result.title}</h2>
              <p className="check-fit-result-text">{result.text}</p>

              {result.showWhatsapp ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="check-fit-whatsapp-btn"
                >
                  המשך לוואטסאפ
                </a>
              ) : null}

              <div className="check-fit-trust">
                {CHECK_FIT_TRUST_LINES.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </div>

              <p className="check-fit-privacy">{CHECK_FIT_PRIVACY}</p>

              <div className="check-fit-website">
                רוצים להכיר אותנו יותר?
                <br />
                <br />
                <a href={SITE.domain} target="_blank" rel="noopener noreferrer">
                  adwrks.co.il
                </a>
              </div>

              <button type="button" className="check-fit-back-btn" onClick={goBackFromSuccess}>
                ← חזור לשלב הקודם
              </button>
            </section>
          ) : null}
        </div>
      </Container>
    </article>
  );
}
