import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface WelcomeEmailProps {
  username: string;
  dashboardUrl?: string;
}

export const WelcomeEmail = ({
  username,
  dashboardUrl = 'https://wietforumbelgie.com',
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welkom in de WietForum België community! 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoSection}>
          <Img
            src="https://yopswdnayrogadtxpwzm.supabase.co/storage/v1/object/public/assets/wietforum-logo-transparent.png"
            width="180"
            height="60"
            alt="WietForum België"
            style={logo}
          />
        </Section>
        
        <Heading style={h1}>Welkom {username}! 🎉</Heading>
        
        <Text style={text}>
          Je bent nu officieel lid van de grootste cannabis community van België!
        </Text>
        
        <Section style={highlightBox}>
          <Text style={highlightTitle}>✨ Wat kun je nu doen?</Text>
          
          <Section style={featureItem}>
            <Text style={featureEmoji}>💬</Text>
            <Text style={featureText}>
              <strong>Start Discussies</strong><br />
              Deel je ervaringen en stel vragen aan de community
            </Text>
          </Section>
          
          <Section style={featureItem}>
            <Text style={featureEmoji}>🏪</Text>
            <Text style={featureText}>
              <strong>Ontdek Leveranciers</strong><br />
              Bekijk reviews en vind betrouwbare suppliers
            </Text>
          </Section>
          
          <Section style={featureItem}>
            <Text style={featureEmoji}>🌱</Text>
            <Text style={featureText}>
              <strong>Deel je Groei</strong><br />
              Post updates over je planten en leer van experts
            </Text>
          </Section>
          
          <Section style={featureItem}>
            <Text style={featureEmoji}>🏆</Text>
            <Text style={featureText}>
              <strong>Verdien Badges</strong><br />
              Krijg punten en achievements door actief te zijn
            </Text>
          </Section>
        </Section>
        
        <Section style={buttonContainer}>
          <Button style={button} href={dashboardUrl}>
            Start met Browsen
          </Button>
        </Section>
        
        <Section style={tipBox}>
          <Text style={tipTitle}>💡 Pro tip</Text>
          <Text style={tipText}>
            Complete je profiel met een avatar en bio om meer vertrouwen op te bouwen
            binnen de community. Members met een compleet profiel krijgen 3x meer reacties!
          </Text>
        </Section>
        
        <Text style={text}>
          Heb je vragen? De community staat altijd klaar om te helpen!
        </Text>
        
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 WietForum België - De grootste cannabis community van België
          </Text>
          <Text style={footerText}>
            <Link href="https://wietforumbelgie.com" style={footerLink}>
              wietforumbelgie.com
            </Link>
            {' • '}
            <Link href="https://wietforumbelgie.com/forums" style={footerLink}>
              Forums
            </Link>
            {' • '}
            <Link href="https://wietforumbelgie.com/suppliers" style={footerLink}>
              Leveranciers
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;

const main = {
  backgroundColor: '#fefefe',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const logoSection = {
  padding: '20px 0',
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#3a4f00',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#344154',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#3a4f00',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
};

const highlightBox = {
  backgroundColor: '#f0f9e8',
  border: '2px solid #3a4f00',
  borderRadius: '12px',
  padding: '24px',
  margin: '32px 0',
};

const highlightTitle = {
  color: '#3a4f00',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const featureItem = {
  display: 'flex',
  alignItems: 'flex-start',
  margin: '16px 0',
};

const featureEmoji = {
  fontSize: '24px',
  marginRight: '12px',
  minWidth: '32px',
};

const featureText = {
  color: '#344154',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
};

const tipBox = {
  backgroundColor: '#fff9e6',
  border: '1px solid #ffc107',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const tipTitle = {
  color: '#856404',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 8px',
};

const tipText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
};

const footer = {
  borderTop: '1px solid #e5e7eb',
  marginTop: '40px',
  paddingTop: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '20px',
  margin: '4px 0',
};

const footerLink = {
  color: '#3a4f00',
  textDecoration: 'underline',
};
