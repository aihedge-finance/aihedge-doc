import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  icon: string;
  gradient: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'AI-Powered Allocation',
    icon: '🧠',
    gradient: 'linear-gradient(135deg, hsl(168,72%,52%) 0%, hsl(200,80%,55%) 100%)',
    description: (
      <>
        Reinforcement learning and regime-detection models continuously analyze yield
        opportunities, gas costs, and liquidity depth — dynamically routing capital
        to maximize risk-adjusted returns in real time.
      </>
    ),
  },
  {
    title: 'Non-Custodial Vaults',
    icon: '🔐',
    gradient: 'linear-gradient(135deg, hsl(260,70%,62%) 0%, hsl(168,72%,52%) 100%)',
    description: (
      <>
        Built on the ERC-4626 vault standard, AI Hedge vaults are fully non-custodial.
        Depositors retain sovereign exit rights at all times — no lock-ups, no
        permissions, no intermediaries.
      </>
    ),
  },
  {
    title: 'Multi-Chain Engine',
    icon: '⚡',
    gradient: 'linear-gradient(135deg, hsl(38,90%,55%) 0%, hsl(168,72%,52%) 100%)',
    description: (
      <>
        A cross-chain deployment layer routes capital across Ethereum, Arbitrum,
        and emerging EVM networks — capturing premium yield from the best protocols
        wherever opportunity arises.
      </>
    ),
  },
];

function Feature({title, icon, gradient, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div className={styles.featureCard}>
        <div className={styles.featureIconWrap}>
          <div className={styles.featureIconBg} style={{background: gradient}} />
          <span className={styles.featureIcon}>{icon}</span>
        </div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDesc}>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Protocol Capabilities</span>
          <Heading as="h2" className={styles.sectionTitle}>
            Built for serious capital
          </Heading>
          <p className={styles.sectionSubtitle}>
            Every component of AI Hedge is designed for institutional-grade
            yield optimization — precise, transparent, and non-custodial.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
