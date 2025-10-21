import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Terms() {
  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Algemene Voorwaarden</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-6">
              Laatst bijgewerkt: {new Date().toLocaleDateString('nl-BE')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptatie van de voorwaarden</h2>
              <p className="mb-4">
                Door toegang te krijgen tot en gebruik te maken van WietForum België, gaat u akkoord met deze algemene voorwaarden. 
                Als u niet akkoord gaat met deze voorwaarden, mag u het platform niet gebruiken.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Leeftijdsvereiste</h2>
              <p className="mb-4">
                U moet minimaal 18 jaar oud zijn om dit platform te gebruiken. Door een account aan te maken, bevestigt u dat u aan deze leeftijdseis voldoet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Gebruikersaccount</h2>
              <p className="mb-4">
                U bent verantwoordelijk voor het vertrouwelijk houden van uw accountgegevens en voor alle activiteiten die onder uw account plaatsvinden.
                U moet WietForum België onmiddellijk op de hoogte stellen van elk ongeautoriseerd gebruik van uw account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Gedragscode</h2>
              <p className="mb-4">Bij gebruik van WietForum België verbindt u zich ertoe:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Geen illegale activiteiten te promoten of te faciliteren</li>
                <li>Respectvol te communiceren met andere gebruikers</li>
                <li>Geen spam, reclame of misleidende content te plaatsen</li>
                <li>De privacy van andere gebruikers te respecteren</li>
                <li>Geen intellectuele eigendomsrechten te schenden</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Content en intellectueel eigendom</h2>
              <p className="mb-4">
                U behoudt alle rechten op de content die u op het platform plaatst. Door content te plaatsen, verleent u WietForum België 
                een niet-exclusieve, wereldwijde, royaltyvrije licentie om deze content te gebruiken, reproduceren en distribueren.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Moderatie en verwijdering van content</h2>
              <p className="mb-4">
                WietForum België behoudt zich het recht voor om content te verwijderen of accounts te blokkeren die in strijd zijn met deze voorwaarden 
                of schadelijk zijn voor de community.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Aansprakelijkheid</h2>
              <p className="mb-4">
                WietForum België wordt geleverd "zoals het is" zonder enige garantie. Wij zijn niet aansprakelijk voor schade die voortvloeit uit het gebruik 
                van het platform of de content die erop wordt gedeeld.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Wijzigingen in de voorwaarden</h2>
              <p className="mb-4">
                WietForum België kan deze voorwaarden op elk moment wijzigen. Wijzigingen worden van kracht zodra ze op het platform worden gepubliceerd.
                Voortgezet gebruik van het platform na wijzigingen betekent acceptatie van de nieuwe voorwaarden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Beëindiging</h2>
              <p className="mb-4">
                U kunt uw account op elk moment verwijderen via de instellingenpagina. WietForum België kan accounts beëindigen die in strijd 
                zijn met deze voorwaarden.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Toepasselijk recht</h2>
              <p className="mb-4">
                Deze voorwaarden worden beheerst door het Belgische recht. Geschillen zullen worden behandeld door de bevoegde rechtbanken in België.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact</h2>
              <p className="mb-4">
                Voor vragen over deze voorwaarden kunt u contact met ons opnemen via het forum of onze contactpagina.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
