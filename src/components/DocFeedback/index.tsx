import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

const FORMBRICKS_SURVEY_ID = 'cmtjnbj61ut2u01ul64e4pb2g';
const FORMBRICKS_URL = `https://app.formbricks.com/s/${FORMBRICKS_SURVEY_ID}`;

const POSITIVE_REASONS = [
  'Clear explanations',
  'Helpful code examples',
  'Easy to follow',
  'Accurate & up to date',
];

const NEGATIVE_REASONS = [
  'Confusing explanation',
  'Missing details / steps',
  'Broken link or code',
  'Outdated information',
  'Too technical',
];

export default function DocFeedback(): React.JSX.Element {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [vote, setVote] = useState<'yes' | 'no' | null>(null);
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
      // Reset state on path change
      setStep(1);
      setVote(null);
      setSelectedReasons([]);
      setComment('');
    }
  }, [typeof window !== 'undefined' ? window.location.pathname : '']);

  const handleVote = (type: 'yes' | 'no') => {
    setVote(type);
    setStep(2); // Automatically advance to Step 2: "Ask for Why"

    if (typeof window !== 'undefined' && (window as any).formbricks?.track) {
      try {
        (window as any).formbricks.track(
          type === 'yes' ? 'docs_page_helpful' : 'docs_page_unhelpful',
          {
            page: window.location.href,
            path: window.location.pathname,
          }
        );
      } catch (e) {
        // fail silently
      }
    }
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);

    if (typeof window !== 'undefined' && (window as any).formbricks?.track) {
      try {
        (window as any).formbricks.track('docs_feedback_elaborated', {
          isHelpful: vote === 'yes',
          reasons: selectedReasons,
          comment: comment.trim(),
          page: window.location.href,
          path: window.location.pathname,
        });
      } catch (e) {
        // fail silently
      }
    }
  };

  const handleSkip = () => {
    setStep(3);
  };

  const reasonsList = vote === 'yes' ? POSITIVE_REASONS : NEGATIVE_REASONS;

  const fullSurveyLink = `${FORMBRICKS_URL}?Page%20URL=${encodeURIComponent(
    currentUrl
  )}&page=${encodeURIComponent(currentUrl)}`;

  return (
    <div className={styles.feedbackContainer}>
      {/* Step 1: Was this page helpful? */}
      {step === 1 && (
        <div className={styles.stepOneRow}>
          <div className={styles.feedbackTitle}>
            <span>Was this page helpful?</span>
          </div>
          <div className={styles.feedbackButtons}>
            <button
              type="button"
              className={styles.feedbackBtn}
              onClick={() => handleVote('yes')}
              aria-label="Yes, this page was helpful"
            >
              <span>👍</span>
              <span>Yes</span>
            </button>
            <button
              type="button"
              className={styles.feedbackBtn}
              onClick={() => handleVote('no')}
              aria-label="No, this page was not helpful"
            >
              <span>👎</span>
              <span>No</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Next step to ask for why */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className={styles.stepTwoContainer}>
          <div className={styles.stepTwoHeader}>
            <span className={styles.stepTwoTitle}>
              {vote === 'yes'
                ? '👍 Glad to hear it! What was most helpful?'
                : '👎 Sorry about that! How can we improve this page?'}
            </span>
          </div>

          <div className={styles.tagGroup}>
            {reasonsList.map((reason) => {
              const isActive = selectedReasons.includes(reason);
              return (
                <button
                  type="button"
                  key={reason}
                  className={`${styles.tagBtn} ${
                    isActive ? styles.tagBtnActive : ''
                  }`}
                  onClick={() => toggleReason(reason)}
                >
                  {reason}
                </button>
              );
            })}
          </div>

          <textarea
            className={styles.textarea}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={
              vote === 'yes'
                ? 'Anything else you liked? (optional)'
                : 'Please elaborate or tell us what went wrong (optional)...'
            }
            rows={3}
          />

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.skipBtn}
              onClick={handleSkip}
            >
              Skip
            </button>
            <button type="submit" className={styles.submitBtn}>
              Submit Feedback
            </button>
          </div>
        </form>
      )}

      {/* Step 3: Thank you state */}
      {step === 3 && (
        <div className={styles.thankYouContainer}>
          <div className={styles.thankYouText}>
            <span>✓ Thank you! Your feedback helps us improve the docs.</span>
          </div>
          <a
            href={fullSurveyLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.formbricksLink}
          >
            Open in Formbricks ↗
          </a>
        </div>
      )}
    </div>
  );
}
