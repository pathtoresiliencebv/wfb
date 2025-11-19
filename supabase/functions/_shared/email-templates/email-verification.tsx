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

interface EmailVerificationProps {
  verificationLink: string;
  token?: string;
  username?: string;
}

export const EmailVerificationEmail = ({
  verificationLink,
  token,
  username = 'daar',
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Preview>Welkom bij WietForum België - Verifieer je email</Preview>
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
        
        <Heading style={h1}>Welkom bij WietForum België! 🌿</Heading>
        
        <Text style={text}>
          Hey {username},
        </Text>
        
        <Text style={text}>
          Bedankt voor je registratie bij WietForum België, de grootste cannabis community van België!
        </Text>
        
        <Text style={text}>
          Om je account te activeren, verifieer je email adres door op onderstaande knop te klikken:
        </Text>
        
        <Section style={buttonContainer}>
          <Button style={button} href={verificationLink}>
            Verifieer Email Adres
          </Button>
        </Section>
        
        {token && (
          <>
            <Text style={textSmall}>
              Of kopieer deze verificatiecode:
            </Text>
            <Section style={codeBox}>
              <Text style={code}>{token}</Text>
            </Section>
          </>
        )}
        
        <Section style={infoBox}>
          <Text style={infoTitle}>🎉 Wat kun je verwachten?</Text>
          <Text style={infoText}>
            • Discussieer met duizenden cannabis liefhebbers<br />
            • Ontdek de beste leveranciers van België<br />
            • Deel je groei-ervaringen en tips<br />
            • Blijf op de hoogte van wetgeving<br />
            • Verdien badges en punten door actief te zijn
          </Text>
        </Section>
        
        <Text style={text}>
          Als je deze registratie niet hebt gedaan, kun je deze email veilig negeren.
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

export default EmailVerificationEmail;

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

const codeBox = {
  backgroundColor: '#f3f4f6',
  border: '2px dashed #3a4f00',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
};

const code = {
  color: '#3a4f00',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '4px',
  textAlign: 'center' as const,
  margin: '0',
  fontFamily: 'monospace',
};

const infoBox = {
  backgroundColor: '#f0f9e8',
  border: '1px solid #3a4f00',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const infoTitle = {
  color: '#3a4f00',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 12px',
};

const infoText = {
  color: '#344154',
  fontSize: '14px',
  lineHeight: '24px',
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
