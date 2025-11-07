export const cannabisTips = [
  "Bewaar cannabis op een koele, donkere plaats om de kwaliteit te behouden.",
  "CBD heeft geen psychoactieve effecten, in tegenstelling tot THC.",
  "De geur van cannabis komt van terpenen, niet van cannabinoïden.",
  "Indica strains hebben vaak een ontspannend effect, terwijl Sativa strains energiek maken.",
  "De kleur van trichomen kan aangeven wanneer cannabis klaar is voor oogsten.",
  "Decarboxylatie is nodig om THC te activeren bij het maken van edibles.",
  "Cannabis kan helpen bij het verminderen van chronische pijn.",
  "Het endocannabinoïde systeem reguleert vele functies in het menselijk lichaam.",
  "Verschillende consumptie methodes hebben verschillende effecten en duur.",
  "Hydratatie is belangrijk bij cannabis gebruik om droge mond te voorkomen.",
  "Cannabis kan de eetlust stimuleren, ook wel 'munchies' genoemd.",
  "Tolerance breaks kunnen helpen om de effectiviteit te behouden.",
  "Cannabis heeft meer dan 100 verschillende cannabinoïden.",
  "Lichtcyclus is cruciaal voor de groei van cannabis planten.",
  "Cannabis kan de slaapkwaliteit verbeteren bij sommige gebruikers.",
  "De pH-waarde van de bodem is belangrijk voor gezonde planten.",
  "Verschillende terpenen geven cannabis unieke geuren en smaken.",
  "Cannabis kan angst verminderen in lage doses, maar verhogen in hoge doses.",
  "Goede ventilatie is essentieel bij het kweken van cannabis.",
  "Cannabis zaadjes kunnen jarenlang levensvatbaar blijven bij juiste opslag.",
  "Het malen van cannabis vergroot het oppervlak voor betere verbranding.",
  "Cannabis kan de creativiteit stimuleren bij sommige gebruikers.",
  "Water geven moet gebeuren op basis van de behoefte van de plant, niet op schema.",
  "Cannabis bevat flavonoïden die bijdragen aan kleur en gezondheidsvoordelen.",
  "Ruderalis strains bloeien automatisch ongeacht de lichtcyclus.",
  "Cannabis kan helpen bij het verminderen van misselijkheid.",
  "Goede luchtvochtigheid is belangrijk voor optimale groei.",
  "THC breekt af tot CBN bij langdurige opslag, wat een sedatief effect heeft.",
  "Cannabis kan de perceptie van tijd veranderen.",
  "Organische voedingsstoffen kunnen de smaak van cannabis verbeteren.",
  "Cannabis heeft anti-inflammatoire eigenschappen.",
  "Training technieken kunnen de opbrengst van cannabis planten verhogen.",
  "Cannabis kan helpen bij PTSD symptomen.",
  "De kleur van cannabis kan variëren van groen tot paars door anthocyanine.",
  "Flushing voor de oogst kan de smaak verbeteren.",
  "Cannabis kan de focus verbeteren bij sommige mensen met ADHD.",
  "Crossbreeding heeft geleid tot duizenden unieke strains.",
  "Cannabis kan spierverslapping bevorderen.",
  "LED lampen zijn energie-efficiënt voor cannabis kweek.",
  "Cannabis kan helpen bij epilepsie, vooral CBD-rijke strains.",
  "Trimmen van bladeren verbetert de luchtstroom en voorkomt schimmel.",
  "Cannabis kan de hartslag verhogen na consumptie.",
  "Companion planting kan plagen natuurlijk weren bij cannabis kweek.",
  "Cannabis extracten kunnen veel krachtiger zijn dan bloemen.",
  "Goed drogen en curen verbetert de smaak en potentie aanzienlijk.",
  "Cannabis kan de bloeddruk beïnvloeden.",
  "Autoflowering strains zijn ideaal voor beginners.",
  "Cannabis terpenen hebben hun eigen therapeutische eigenschappen.",
  "Stress training kan de opbrengst en kwaliteit verhogen.",
  "Cannabis gebruik kan de korte termijn geheugen beïnvloeden.",
  "Biologische pesticiden zijn veiliger voor cannabis kweek.",
];

export const getDailyTip = (): string => {
  const today = new Date();
  // Calculate day of year
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Use day of year to get consistent tip per day
  const index = dayOfYear % cannabisTips.length;
  return cannabisTips[index];
};
