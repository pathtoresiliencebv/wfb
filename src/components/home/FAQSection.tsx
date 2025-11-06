import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: 'Is Wiet Forum België legaal?',
    answer: 'Ja, ons forum is volledig legaal. We faciliteren enkel informatiedeling over cannabis. Alle activiteiten voldoen aan Belgische wetgeving.',
  },
  {
    question: 'Moet ik betalen om lid te worden?',
    answer: 'Nee, lidmaatschap is 100% gratis. Je krijgt direct toegang tot alle forums en functies.',
  },
  {
    question: 'Zijn leveranciers gescreend?',
    answer: 'Ja, alle gelabelde leveranciers worden zorgvuldig gescreend. Echter, blijf altijd voorzichtig bij transacties.',
  },
  {
    question: 'Hoe verdien ik punten en badges?',
    answer: 'Je verdient XP door actief te zijn: topics starten, reageren, upvotes ontvangen. Check het Gamification systeem voor details.',
  },
  {
    question: 'Kan ik anoniem blijven?',
    answer: 'Ja, je kan een anonieme username kiezen. We vragen geen persoonlijke informatie.',
  },
  {
    question: 'Wat als ik een scam ervaar?',
    answer: 'Meld dit direct via onze report functie. We nemen alle meldingen serieus en handelen snel.',
  },
  {
    question: 'Mag ik mijn producten verkopen?',
    answer: 'Alleen geverifieerde leveranciers kunnen producten aanbieden. Vraag supplier status aan via je profiel.',
  },
  {
    question: 'Hoe wordt mijn data beschermd?',
    answer: 'We gebruiken encryptie en voldoen aan GDPR. Je data wordt nooit gedeeld met derden.',
  },
];

export function FAQSection() {
  const halfLength = Math.ceil(faqs.length / 2);
  const leftColumn = faqs.slice(0, halfLength);
  const rightColumn = faqs.slice(halfLength);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Veelgestelde Vragen</h2>
        <p className="text-muted-foreground">
          Alles wat je moet weten over Wiet Forum België
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <Accordion type="single" collapsible className="space-y-4">
          {leftColumn.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Right Column */}
        <Accordion type="single" collapsible className="space-y-4">
          {rightColumn.map((faq, index) => (
            <AccordionItem 
              key={index + halfLength} 
              value={`item-${index + halfLength}`}
              className="border rounded-lg px-6 bg-card"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="text-center">
        <Link 
          to="/forums" 
          className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
        >
          Nog vragen? Stel ze in ons forum
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
