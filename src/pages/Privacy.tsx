import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Privacy() {
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacybeleid</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-6">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-BE')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Inleiding</h2>
              <p className="mb-4">
                WietForum België ("wij", "ons" of "onze") respecteert uw privacy en is toegewijd aan het beschermen van uw persoonlijke gegevens. 
                Dit privacybeleid legt uit hoe wij uw persoonlijke informatie verzamelen, gebruiken en beschermen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Gegevens die we verzamelen</h2>
              <p className="mb-4">We verzamelen de volgende soorten gegevens:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Accountgegevens:</strong> gebruikersnaam, e-mailadres, wachtwoord (versleuteld), geboortedatum</li>
                <li><strong>Profielinformatie:</strong> avatar, bio, locatie (optioneel)</li>
                <li><strong>Gebruiksgegevens:</strong> berichten, topics, reacties, stemmen, badges en punten</li>
                <li><strong>Technische gegevens:</strong> IP-adres, browsertype, apparaatinformatie, cookies</li>
                <li><strong>Communicatiegegevens:</strong> privéberichten tussen gebruikers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Hoe we uw gegevens gebruiken</h2>
              <p className="mb-4">We gebruiken uw gegevens voor:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Het leveren en verbeteren van onze diensten</li>
                <li>Account authenticatie en beveiliging</li>
                <li>Communicatie met u over uw account of diensten</li>
                <li>Personalisatie van uw ervaring op het platform</li>
                <li>Moderatie en handhaving van onze gebruiksvoorwaarden</li>
                <li>Analyse van gebruikspatronen om onze diensten te verbeteren</li>
                <li>Naleving van wettelijke verplichtingen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Delen van gegevens</h2>
              <p className="mb-4">
                We verkopen uw persoonlijke gegevens niet. We kunnen uw gegevens delen met:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Andere gebruikers:</strong> uw openbare profielinformatie en posts zijn zichtbaar voor andere gebruikers</li>
                <li><strong>Dienstverleners:</strong> voor hosting, analytics en andere technische diensten</li>
                <li><strong>Wetshandhavingsinstanties:</strong> wanneer wettelijk vereist of om onze rechten te beschermen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Gegevensbeveiliging</h2>
              <p className="mb-4">
                We implementeren passende technische en organisatorische maatregelen om uw persoonlijke gegevens te beschermen tegen 
                ongeautoriseerde toegang, wijziging, openbaarmaking of vernietiging. Dit omvat:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Versleuteling van wachtwoorden en gevoelige data</li>
                <li>Beveiligde communicatie (HTTPS/SSL)</li>
                <li>Regelmatige beveiligingsupdates en monitoring</li>
                <li>Beperkte toegang tot persoonlijke gegevens</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Uw rechten</h2>
              <p className="mb-4">Onder de AVG heeft u de volgende rechten:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Recht op toegang:</strong> u kunt een kopie opvragen van uw persoonlijke gegevens</li>
                <li><strong>Recht op rectificatie:</strong> u kunt onjuiste gegevens laten corrigeren</li>
                <li><strong>Recht op gegevenswissing:</strong> u kunt uw account en gegevens verwijderen</li>
                <li><strong>Recht op beperking:</strong> u kunt de verwerking van uw gegevens beperken</li>
                <li><strong>Recht op overdraagbaarheid:</strong> u kunt uw gegevens in een gestructureerd formaat ontvangen</li>
                <li><strong>Recht van bezwaar:</strong> u kunt bezwaar maken tegen bepaalde verwerkingen</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="mb-4">
                We gebruiken cookies en vergelijkbare technologieën om uw sessie te beheren, voorkeuren op te slaan en het gebruik van ons platform te analyseren. 
                U kunt cookies beheren via uw browserinstellingen.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Gegevensbewaring</h2>
              <p className="mb-4">
                We bewaren uw persoonlijke gegevens zo lang als nodig is voor de doeleinden beschreven in dit beleid, tenzij een langere bewaartermijn 
                wettelijk vereist of toegestaan is. Wanneer u uw account verwijdert, worden uw persoonlijke gegevens binnen 30 dagen verwijderd, 
                behalve waar we wettelijk verplicht zijn deze te bewaren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Minderjarigen</h2>
              <p className="mb-4">
                Ons platform is uitsluitend bedoeld voor personen van 18 jaar en ouder. We verzamelen niet bewust gegevens van minderjarigen. 
                Als u denkt dat we per ongeluk gegevens van een minderjarige hebben verzameld, neem dan contact met ons op.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Wijzigingen in dit beleid</h2>
              <p className="mb-4">
                We kunnen dit privacybeleid van tijd tot tijd bijwerken. Wijzigingen worden van kracht zodra ze op deze pagina worden gepubliceerd. 
                We raden u aan dit beleid regelmatig te controleren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Contact</h2>
              <p className="mb-4">
                Als u vragen heeft over dit privacybeleid of uw gegevensrechten wilt uitoefenen, kunt u contact met ons opnemen via het forum 
                of onze contactpagina.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Gegevensbeschermingsautoriteit</h2>
              <p className="mb-4">
                Als u niet tevreden bent met hoe we met uw gegevens omgaan, heeft u het recht om een klacht in te dienen bij de Belgische 
                Gegevensbeschermingsautoriteit.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
