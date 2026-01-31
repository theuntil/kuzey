export type CityItem = { slug: string; labelTR: string };

export const CITIES: CityItem[] = [
  { slug: "adana", labelTR: "Adana" },
  { slug: "adiyaman", labelTR: "Adıyaman" },
  { slug: "afyonkarahisar", labelTR: "Afyonkarahisar" },
  { slug: "agri", labelTR: "Ağrı" },
  { slug: "aksaray", labelTR: "Aksaray" },
  { slug: "amasya", labelTR: "Amasya" },
  { slug: "ankara", labelTR: "Ankara" },
  { slug: "antalya", labelTR: "Antalya" },
  { slug: "ardahan", labelTR: "Ardahan" },
  { slug: "artvin", labelTR: "Artvin" },
  { slug: "aydin", labelTR: "Aydın" },
  { slug: "balikesir", labelTR: "Balıkesir" },
  { slug: "bartin", labelTR: "Bartın" },
  { slug: "batman", labelTR: "Batman" },
  { slug: "bayburt", labelTR: "Bayburt" },
  { slug: "bilecik", labelTR: "Bilecik" },
  { slug: "bingol", labelTR: "Bingöl" },
  { slug: "bitlis", labelTR: "Bitlis" },
  { slug: "bolu", labelTR: "Bolu" },
  { slug: "burdur", labelTR: "Burdur" },
  { slug: "bursa", labelTR: "Bursa" },
  { slug: "canakkale", labelTR: "Çanakkale" },
  { slug: "cankiri", labelTR: "Çankırı" },
  { slug: "corum", labelTR: "Çorum" },
  { slug: "denizli", labelTR: "Denizli" },
  { slug: "diyarbakir", labelTR: "Diyarbakır" },
  { slug: "duzce", labelTR: "Düzce" },
  { slug: "edirne", labelTR: "Edirne" },
  { slug: "elazig", labelTR: "Elazığ" },
  { slug: "erzincan", labelTR: "Erzincan" },
  { slug: "erzurum", labelTR: "Erzurum" },
  { slug: "eskisehir", labelTR: "Eskişehir" },
  { slug: "gaziantep", labelTR: "Gaziantep" },
  { slug: "giresun", labelTR: "Giresun" },
  { slug: "gumushane", labelTR: "Gümüşhane" },
  { slug: "hakkari", labelTR: "Hakkâri" },
  { slug: "hatay", labelTR: "Hatay" },
  { slug: "igdir", labelTR: "Iğdır" },
  { slug: "isparta", labelTR: "Isparta" },
  { slug: "istanbul", labelTR: "İstanbul" },
  { slug: "izmir", labelTR: "İzmir" },
  { slug: "kahramanmaras", labelTR: "Kahramanmaraş" },
  { slug: "karabuk", labelTR: "Karabük" },
  { slug: "karaman", labelTR: "Karaman" },
  { slug: "kars", labelTR: "Kars" },
  { slug: "kastamonu", labelTR: "Kastamonu" },
  { slug: "kayseri", labelTR: "Kayseri" },
  { slug: "kilis", labelTR: "Kilis" },
  { slug: "kirikkale", labelTR: "Kırıkkale" },
  { slug: "kirklareli", labelTR: "Kırklareli" },
  { slug: "kirsehir", labelTR: "Kırşehir" },
  { slug: "kocaeli", labelTR: "Kocaeli" },
  { slug: "konya", labelTR: "Konya" },
  { slug: "kutahya", labelTR: "Kütahya" },
  { slug: "malatya", labelTR: "Malatya" },
  { slug: "manisa", labelTR: "Manisa" },
  { slug: "mardin", labelTR: "Mardin" },
  { slug: "mersin", labelTR: "Mersin" },
  { slug: "mugla", labelTR: "Muğla" },
  { slug: "mus", labelTR: "Muş" },
  { slug: "nevsehir", labelTR: "Nevşehir" },
  { slug: "nigde", labelTR: "Niğde" },
  { slug: "ordu", labelTR: "Ordu" },
  { slug: "osmaniye", labelTR: "Osmaniye" },
  { slug: "rize", labelTR: "Rize" },
  { slug: "sakarya", labelTR: "Sakarya" },
  { slug: "samsun", labelTR: "Samsun" },
  { slug: "sanliurfa", labelTR: "Şanlıurfa" },
  { slug: "siirt", labelTR: "Siirt" },
  { slug: "sinop", labelTR: "Sinop" },
  { slug: "sirnak", labelTR: "Şırnak" },
  { slug: "sivas", labelTR: "Sivas" },
  { slug: "tekirdag", labelTR: "Tekirdağ" },
  { slug: "tokat", labelTR: "Tokat" },
  { slug: "trabzon", labelTR: "Trabzon" },
  { slug: "tunceli", labelTR: "Tunceli" },
  { slug: "usak", labelTR: "Uşak" },
  { slug: "van", labelTR: "Van" },
  { slug: "yalova", labelTR: "Yalova" },
  { slug: "yozgat", labelTR: "Yozgat" },
  { slug: "zonguldak", labelTR: "Zonguldak" },
];


export function toSlug(input: string) {
  return (input ?? "")
    .trim()
    .toLowerCase()
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fromSlugOrNull(slug: string) {
  const s = toSlug(slug);
  return CITIES.find((c) => c.slug === s) ?? null;
}
