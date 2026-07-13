import {
  Alert,
  Button,
  Container,
  Grid,
  Heading,
  Input,
  PageHeader,
  Paragraph,
  ProgrammeCard,
  Section,
  StatisticCard,
} from ".";

/**
 * SystemExamples demonstrates common component combinations.
 * This file is documentation-only and should not be routed as a page.
 */
export function SystemExamples() {
  return (
    <Section tone="muted">
      <Container>
        <PageHeader
          eyebrow="Design System"
          title="Reusable RHARK UI"
          description="A production-ready component foundation for RHARK pages."
        />

        <Grid className="mt-10">
          <ProgrammeCard
            title="SRHR"
            description="Reusable programme card example."
            href="/programmes/srhr"
          />
          <StatisticCard value="5,000+" label="Youth reached" />
          <Alert tone="success" title="Accessible feedback">
            Form and system messages use semantic roles.
          </Alert>
        </Grid>

        <div className="mt-10 max-w-xl space-y-5">
          <Heading level={2}>Form example</Heading>
          <Paragraph>Fields include labels, hints, validation state, and ARIA relationships.</Paragraph>
          <Input label="Email address" type="email" hint="Use an active email address." />
        </div>
      </Container>
    </Section>
  );
}
