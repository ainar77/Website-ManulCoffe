import { createFileRoute } from "@tanstack/react-router";

import { SITE_URL } from "@/lib/siteConfig";
import { getPublicBusinessSeoData } from "@/lib/publicBusinessSeo.functions";
import { PrivacyPage } from "./-privacy";

const title = "Privātuma politika — ManulCoffee";
const description =
  "Informācija par personas datu apstrādi ManulCoffee demonstrācijas vietnē un galdiņa rezervācijas procesā.";

export const Route = createFileRoute("/lv/privacy")({
  loader: async () => getPublicBusinessSeoData(),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/lv/privacy` },
      { property: "og:site_name", content: "ManulCoffee" },
      { property: "og:locale", content: "lv_LV" },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/lv/privacy` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/privacy` },
      { rel: "alternate", hrefLang: "lv", href: `${SITE_URL}/lv/privacy` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/privacy` },
    ],
  }),
  component: LatvianPrivacyRoute,
});

function LatvianPrivacyRoute() {
  const data = Route.useLoaderData();
  const businessName = data?.settings?.business_name?.trim() || "ManulCoffee";
  const contactEmail = data?.settings?.contact_email?.trim() || null;

  return (
    <PrivacyPage
      language="lv"
      businessName={businessName}
      contactEmail={contactEmail}
      eyebrow="Privātums un personas dati"
      title="Privātuma politika"
      updatedLabel="Pēdējo reizi atjaunināta"
      updatedDate="2026. gada 6. oktobrī"
      intro="Šajā politikā ir izskaidrots, kādi personas dati tiek apstrādāti, izmantojot ManulCoffee tīmekļvietni un iesniedzot galdiņa rezervāciju, kādiem nolūkiem dati tiek izmantoti, kuri pakalpojumu sniedzēji ir iesaistīti un kādas ir Jūsu tiesības."
      demoNoticeTitle="Portfolio demonstrācijas paziņojums"
      demoNotice="ManulCoffee ir izdomāta portfolio koncepcija. Šī tīmekļvietne demonstrē atkārtoti izmantojamu restorāna platformu, un to nedrīkst uzskatīt par gatavu reāla restorāna privātuma politiku, kamēr nav norādīti faktiskā pārziņa rekvizīti, pārbaudīta hostinga un starptautiskās datu nosūtīšanas kārtība un izvērtēts, vai konfigurētais datu glabāšanas termiņš ir piemērots faktiskajam operatoram."
      homeLabel="Atpakaļ uz ManulCoffee"
      alternateLabel="EN"
      alternateHref="/privacy"
      rightsLabel="Visas tiesības aizsargātas."
      sections={[
        {
          title: "1. Personas datu pārzinis",
          paragraphs: [
            `Šajā portfolio demonstrācijā tīmekļvietne tiek attēlota ar nosaukumu ${businessName}. Reālā ieviešanā ir jānorāda faktiskā juridiskā persona vai organizācija, kas ir personas datu pārzinis, tostarp tās juridiskais nosaukums un atbilstoša kontaktinformācija.`,
            contactEmail
              ? `Ar privātumu saistītos jautājumus par šo demonstrāciju var nosūtīt uz ${contactEmail}.`
              : "Pirms reālas produkcijas izmantošanas ir jākonfigurē kontaktinformācija privātuma jautājumiem.",
          ],
        },
        {
          title: "2. Personas dati, kurus apstrādājam",
          paragraphs: [
            "Iesniedzot galdiņa rezervāciju, sistēma apstrādā informāciju, kas nepieciešama rezervācijas izveidei un pārvaldībai.",
          ],
          items: [
            "vārds un uzvārds;",
            "e-pasta adrese;",
            "tālruņa numurs;",
            "izvēlētā restorāna lokācija;",
            "rezervācijas datums un laiks;",
            "viesu skaits;",
            "rezervācijas statuss;",
            "tehniskā ieraksta informācija, piemēram, rezervācijas identifikators un izveides laiks.",
          ],
        },
        {
          title: "3. Apstrādes nolūki un tiesiskais pamats",
          paragraphs: [
            "Rezervācijas dati tiek apstrādāti, lai saņemtu rezervācijas pieprasījumu, pārbaudītu un pārvaldītu rezervāciju, sazinātos ar viesi par rezervāciju un nosūtītu ar rezervāciju saistītus darījumu paziņojumus.",
            "Reāla restorāna ieviešanā šīs apstrādes galvenais paredzētais tiesiskais pamats ir VDAR 6. panta 1. punkta b) apakšpunkts — apstrāde, kas nepieciešama darbību veikšanai pēc viesa pieprasījuma un pieprasītā rezervācijas pakalpojuma nodrošināšanai. Parastas rezervācijas administrēšanai piekrišana netiek izmantota kā tiesiskais pamats.",
          ],
        },
        {
          title: "4. Pakalpojumu sniedzēji un datu saņēmēji",
          paragraphs: [
            "Tīmekļvietne tiek mitināta un piegādāta, izmantojot Cloudflare Pages. Cloudflare var apstrādāt tehniskos pieprasījumu un tīkla datus, kas nepieciešami hostinga pakalpojuma nodrošināšanai, aizsardzībai un darbībai.",
            "Platforma izmanto Supabase datubāzes, autentifikācijas un servera funkciju infrastruktūrai. Rezervācijas dati tiek glabāti Supabase nodrošinātajā rezervāciju datubāzē.",
            "Platforma izmanto Resend ar rezervāciju saistītu darījumu e-pastu nosūtīšanai. E-pasta pakalpojumam tiek nodoti ziņojuma nosūtīšanai nepieciešamie dati, piemēram, viesa vārds, e-pasta adrese un rezervācijas informācija. Sākotnējā paziņojumā restorānam var tikt iekļauts arī viesa tālruņa numurs.",
            "Pilnvaroti restorāna administratori var piekļūt rezervācijas informācijai aizsargātajā administrācijas sadaļā, ciktāl tas nepieciešams rezervāciju pārvaldībai.",
          ],
        },
        {
          title: "5. Starptautiska datu apstrāde",
          paragraphs: [
            "Precīzas datu apstrādes vietas, apakšapstrādātāji un starptautiskās datu nosūtīšanas kārtība ir atkarīga no operatora izmantotās Cloudflare, Supabase un Resend konfigurācijas. Pirms reālas produkcijas ieviešanas šī kārtība ir jāpārbauda un jādokumentē. Ja personas dati tiek nosūtīti ārpus Eiropas Ekonomikas zonas, pārzinim jānodrošina piemērojams VDAR V nodaļas datu nosūtīšanas mehānisms un atbilstoši aizsardzības pasākumi.",
          ],
        },
        {
          title: "6. Datu glabāšanas termiņš",
          paragraphs: [
            "Supabase datubāzē glabātie rezervāciju ieraksti tiek automātiski dzēsti, kad kopš rezervācijas datuma ir pagājušas vairāk nekā 90 dienas. Šī glabāšanas noteikuma izpildei katru dienu tiek palaista ieplānota datubāzes tīrīšana.",
            "90 dienu termiņš ir šīs platformas konfigurētais glabāšanas termiņš, nevis universāla juridiska prasība. Reālam restorānam ir jāpārbauda, vai šāds termiņš atbilst tā apstrādes nolūkiem un juridiskajiem pienākumiem. Viesim vai restorānam jau nosūtītie darījumu e-pasti var palikt saņēmēju pastkastēs, savukārt Cloudflare, Supabase vai Resend tehniskajiem žurnāliem var būt atsevišķi glabāšanas termiņi. Šīs atsevišķās kopijas un glabāšanas termiņi ir jāpārbauda pirms reālas produkcijas ieviešanas.",
          ],
        },
        {
          title: "7. Jūsu datu aizsardzības tiesības",
          paragraphs: [
            "Ievērojot VDAR noteiktos nosacījumus un izņēmumus, Jums var būt tiesības pieprasīt piekļuvi saviem personas datiem, neprecīzu datu labošanu, dzēšanu, apstrādes ierobežošanu, datu pārnesamību un iebilst pret apstrādi gadījumos, kad tā balstīta uz piemērojamām leģitīmajām interesēm. Jums ir arī tiesības iesniegt sūdzību kompetentajā uzraudzības iestādē, tostarp attiecīgajos gadījumos Latvijas Datu valsts inspekcijā.",
          ],
        },
        {
          title: "8. Sīkdatnes un pārlūkprogrammas krātuve",
          paragraphs: [
            "Publiskā tīmekļvietne pārlūkprogrammas localStorage saglabā izvēlēto EN/LV valodas iestatījumu. Administrācijas sadaļā tiek izmantota pārlūkprogrammas krātuve, kas nepieciešama Supabase autentifikācijai un autorizētu administratoru pierakstīšanās sesijas uzturēšanai.",
            "Pašreizējā publiskā tīmekļvietne neizmanto nebūtiskas reklāmas vai uzvedības analītikas tehnoloģijas, kas būtu identificētas projekta privātuma auditā. Iegultas Google Maps kartes un ārēji mitināti Google Fonts netiek automātiski ielādēti. Norāžu saite var atvērt Google Maps tikai pēc tam, kad apmeklētājs pats izvēlas sekot ārējai saitei; pēc tam ir piemērojama ārējā pakalpojuma privātuma prakse.",
            "Ja nākotnē tiks pievienota nebūtiska analītika, reklāmas vai citas izsekošanas tehnoloģijas, to izmantošana būs jāizvērtē pirms aktivizēšanas un, ja tiesību akti pieprasa piekrišanu, tās nedrīkstēs darboties pirms derīgas piekrišanas saņemšanas.",
          ],
        },
        {
          title: "9. Automatizēta lēmumu pieņemšana",
          paragraphs: [
            "Rezervācijas process neizmanto automatizētu lēmumu pieņemšanu vai profilēšanu, kas viesiem rada juridiskas vai līdzīgi būtiskas sekas.",
          ],
        },
        {
          title: "10. Politikas izmaiņas",
          paragraphs: [
            "Šī politika var tikt atjaunināta, ja mainās platformas datu apstrāde, pakalpojumu sniedzēji, glabāšanas noteikumi vai juridiskās prasības. Lapas augšdaļā norādītais datums identificē aktuālo versiju.",
          ],
        },
      ]}
    />
  );
}
