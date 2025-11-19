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

interface PasswordResetEmailProps {
  resetLink: string;
  expiryMinutes?: number;
}

export const PasswordResetEmail = ({
  resetLink,
  expiryMinutes = 60,
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Preview>Reset je WietForum België wachtwoord</Preview>
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
        
        <Heading style={h1}>Wachtwoord Reset</Heading>
        
        <Text style={text}>
          Je hebt een wachtwoord reset aangevraagd voor je WietForum België account.
        </Text>
        
        <Text style={text}>
          Klik op de onderstaande knop om je wachtwoord te resetten:
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={resetLink}>
            Reset Wachtwoord
          </Button>
        </Section>
        
        <Text style={textSmall}>
          Of kopieer en plak deze link in je browser:
        </Text>
        <Text style={linkText}>{resetLink}</Text>
        
        <Section style={warningBox}>
          <Text style={warningText}>
            ⚠️ Deze link is {expiryMinutes} minuten geldig
          </Text>
        </Section>
        
        <Text style={text}>
          Als je deze reset niet hebt aangevraagd, kun je deze email veilig negeren.
          Je wachtwoord blijft ongewijzigd.
        </Text>
        
        <Section style={footer}>
          <Text style={footerText}>
            © 2024 WietForum België - De grootste cannabis community van België
          </Text>
          <Text style={footerText}>
            <Link href="https://wietforumbelgie.com" style={footerLink}>
              wietforumbelgie.com
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default PasswordResetEmail;

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
  fontSize: '28px',
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
};

const textSmall = {
  color: '#344154',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '16px 0 8px',
};

const linkText = {
  color: '#3a4f00',
  fontSize: '14px',
  lineHeight: '22px',
  wordBreak: 'break-all' as const,
  margin: '0 0 16px',
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

const warningBox = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffc107',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const warningText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
  textAlign: 'center' as const,
  fontWeight: '600',
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
