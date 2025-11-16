"use client";

import { useState } from "react";
import { Box, Typography, IconButton, Button, useTheme, useMediaQuery, List, ListItemButton, ListItemText, Divider, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

export default function FishDatabasePage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Funkcja pomocnicza do mapowania nazw ryb na ścieżki ikon
  const getFishImage = (fishName) => {
    const imageMap = {
      "Welonka (Złota rybka)": "/fish/Welonka__Złota_rybka.png",
      "Gupik (Głupik)": "/fish/Gupik__Głupik.png",
      "Bojownik syjamski": "/fish/Bojownik_syjamski.png",
      "Neon Innesa": "/fish/Neon_Innesa.png",
      "Skalar (Żaglowiec)": "/fish/Skalar__Żaglowiec.png",
      "Mieczyk Hellera": "/fish/Mieczyk_Hellera.png",
      "Molinezja": "/fish/Molinezja.png",
      "Gurami mozaikowy": "/fish/Gurami_mozaikowy.png",
      "Danio pręgowany": "/fish/Danio_pręgowany.png",
      "Kardynałek chiński": "/fish/Kardynałek_chiński.png",
      "Razbora klinowa": "/fish/Razbora_klinowa.png",
      "Tęczanka neonowa": "/fish/Tęczanka_neonowa.png",
      "Kirys pstry": "/fish/Kirys_pstry.png",
      "Glonojad (Zbrojnik)": "/fish/GlonojadZbrojnik-.png",
      "Błazenek pomarańczowy": "/fish/Błazenek_pomarańczowy.png",
      "Pirania czerwona": "/fish/Pirania_czerwona.png",
      "Pokolec królewski": "/fish/Pokolec_królewski.png",
      "Proporczykowiec": "/fish/Proporczykowiec.png",
      "Pyszczak (Malawi)": "/fish/Pyszczak__Malawi.png",
      "Księżniczka z Burundi": "/fish/Księżniczka_z_Burundi.png",
      "Kolcobrzuch karłowaty": "/fish/Kolcobrzuch_karłowaty.png",
      "Mandaryn wspaniały": "/fish/Mandaryn_wspaniały.png",
      "Ustnik żółty": "/fish/Ustnik_żółty_ryba.png",
      "Ustnik słoneczny": "/fish/Ustnik_żółty_ryba.png",
      "Babka złota": "/fish/Babka_złota.png"
    };
    return imageMap[fishName] || "/fish/Welonka__Złota_rybka.png";
  };

  // Funkcja pomocnicza do tłumaczenia typu wody
  const getWaterTypeLabel = (waterType) => {
    const map = {
      "freshwater": "Słodkowodna",
      "brackish": "Słonawa",
      "saltwater": "Słona"
    };
    return map[waterType] || waterType;
  };

  // Funkcja pomocnicza do tłumaczenia usposobienia
  const getTemperamentLabel = (temperament) => {
    const map = {
      "spokojne": "Spokojne",
      "pół-agresywne": "Pół-agresywne",
      "umiarkowane": "Umiarkowane",
      "agresywne": "Agresywne",
      "bardzo agresywne": "Bardzo agresywne"
    };
    return map[temperament] || temperament;
  };

  // Dane kafelków z pełnymi parametrami
  const fishCards = [
    { 
      id: 1, 
      name: "Welonka (Złota rybka)", 
      description: "Welonka (Złota rybka) to spokojna ryba, która porusza się powoli i dobrze czuje się w grupie. Lubi akwaria z roślinami i miejscami do ukrycia. Jest odporna, ale wymaga czystej wody i odpowiedniej temperatury, aby żyć długo.",
      image: getFishImage("Welonka (Złota rybka)"), 
      waterType: "freshwater", 
      waterTypeLabel: "Słodkowodna",
      tempRange: [18, 22], 
      biotope: "Azja",
      phRange: [6.0, 7.5], 
      hardness: [5, 20],
      temperament: "spokojne",
      minSchoolSize: 2,
      lifespan: "5-8 lat"
    },
    { 
      id: 2, 
      name: "Gupik (Głupik)", 
      description: "Gupik to żyworodna, bardzo odporna ryba o wyjątkowo zróżnicowanym ubarwieniu, szczególnie u samców, które mają długie, efektowne ogony. Jest aktywna, towarzyska i łatwa w hodowli, dlatego świetnie sprawdza się u początkujących akwarystów.",
      image: getFishImage("Gupik (Głupik)"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Ameryka Południowa",
      phRange: [6.0, 8.0], 
      hardness: [10, 30],
      temperament: "spokojne",
      minSchoolSize: 5,
      lifespan: "2-3 lata"
    },
    { 
      id: 3, 
      name: "Bojownik syjamski", 
      description: "Bojownik syjamski to efektowna, majestatyczna ryba znana z długich, falujących płetw i intensywnych barw. Samce są terytorialne i potrafią być agresywne wobec innych samców oraz ryb o podobnych płetwach, dlatego zwykle trzyma się je pojedynczo.",
      image: getFishImage("Bojownik syjamski"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [25, 30], 
      biotope: "Azja",
      phRange: [6.0, 8.0], 
      hardness: [1, 19],
      temperament: "pół-agresywne",
      minSchoolSize: 1,
      lifespan: "3-5 lat"
    },
    { 
      id: 4, 
      name: "Neon Innesa", 
      description: "Neon Innesa to drobna, energiczna ryba ławicowa, znana z intensywnego niebieskiego połysku widocznego nawet w słabym oświetleniu.",
      image: getFishImage("Neon Innesa"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [22, 26], 
      biotope: "Ameryka Południowa",
      phRange: [6.5, 7.5], 
      hardness: [1, 12],
      temperament: "spokojne",
      minSchoolSize: 10,
      lifespan: "3-5 lat"
    },
    { 
      id: 5, 
      name: "Skalar (Żaglowiec)", 
      description: "Skalar (Żaglowiec) to ryba pół-agresywna, która najlepiej czuje się w grupie. Lubi dużo miejsca do pływania i rośliny, przy których może się chować. Może pokazywać dominujące zachowania wobec innych ryb, dlatego najlepiej trzymać ją z gatunkami o podobnym temperamencie.",
      image: getFishImage("Skalar (Żaglowiec)"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [25, 29], 
      biotope: "Ameryka Południowa",
      phRange: [6.0, 7.4], 
      hardness: [5, 13],
      temperament: "pół-agresywne",
      minSchoolSize: 5,
      lifespan: "10-15 lat"
    },
    { 
      id: 6, 
      name: "Mieczyk Hellera", 
      description: "Mieczyk Hellera to żyworodna, wyrazista ryba znana z charakterystycznego 'mieczyka' na ogonie samców. Jest ruchliwa, wytrzymała i dobrze odnajduje się w większych akwariach. Choć generalnie towarzyska, potrafi wykazywać lekko dominujące zachowania, zwłaszcza samce między sobą, dlatego najlepiej trzymać ją w większej grupie.",
      image: getFishImage("Mieczyk Hellera"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Ameryka Północna",
      phRange: [6.0, 8.5], 
      hardness: [10, 30],
      temperament: "pół-agresywne",
      minSchoolSize: 8,
      lifespan: "3-5 lat"
    },
    { 
      id: 7, 
      name: "Molinezja", 
      description: "Molinezja to spokojna ryba, która najlepiej czuje się w grupie. Jest aktywna i lubi pływać wśród roślin. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
      image: getFishImage("Molinezja"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Ameryka Południowa",
      phRange: [7.5, 8.5], 
      hardness: [15, 30],
      temperament: "spokojne",
      minSchoolSize: 3,
      lifespan: "3-5 lat"
    },
    { 
      id: 8, 
      name: "Gurami mozaikowy", 
      description: "Gurami mozaikowy to spokojna ryba o charakterystycznym, drobnym, mozaikowym wzorze na ciele. Porusza się powoli i często wykorzystuje wydłużone płetwy piersiowe do badania otoczenia.",
      image: getFishImage("Gurami mozaikowy"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Azja",
      phRange: [5.5, 8.0], 
      hardness: [2, 30],
      temperament: "spokojne",
      minSchoolSize: 2,
      lifespan: "3-5 lat"
    },
    { 
      id: 9, 
      name: "Danio pręgowany", 
      description: "Danio pręgowany to szybka, energiczna ryba ławicowa o smukłym ciele i wyraźnych, poziomych pręgach. Jest bardzo odporna i dobrze adaptuje się do różnych warunków, dzięki czemu świetnie nadaje się dla początkujących.",
      image: getFishImage("Danio pręgowany"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [20, 25], 
      biotope: "Azja",
      phRange: [6.0, 8.0], 
      hardness: [5, 20],
      temperament: "spokojne",
      minSchoolSize: 8,
      lifespan: "3-5 lat"
    },
    { 
      id: 10, 
      name: "Kardynałek chiński", 
      description: "Kardynałek chiński to niewielka, żywa i spokojna ryba o metalicznym połysku i czerwonym zabarwieniu płetw. Jest wyjątkowo odporna i dobrze czuje się nawet w chłodniejszych akwariach. W grupie prezentuje naturalne, harmonijne zachowania, tworząc efektowne mini-ławice.",
      image: getFishImage("Kardynałek chiński"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [18, 24], 
      biotope: "Azja",
      phRange: [6.0, 8.5], 
      hardness: [5, 25],
      temperament: "spokojne",
      minSchoolSize: 6,
      lifespan: "4-5 lat"
    },
    { 
      id: 11, 
      name: "Razbora klinowa", 
      description: "Razbora klinowa to spokojna ryba ławicowa, która najlepiej czuje się w grupie. Jest aktywna i porusza się wśród roślin, tworząc efektowne grupy. Lubi dobrze oświetlone akwaria z miejscami do pływania i kryjówkami.",
      image: getFishImage("Razbora klinowa"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 27], 
      biotope: "Azja",
      phRange: [5.0, 7.5], 
      hardness: [1, 12],
      temperament: "spokojne",
      minSchoolSize: 10,
      lifespan: "5-8 lat"
    },
    { 
      id: 12, 
      name: "Tęczanka neonowa", 
      description: "Tęczanka neonowa to spokojna ryba ławicowa, która najlepiej czuje się w grupie. Ma kolorowe, metaliczne ubarwienie i lubi poruszać się wśród roślin. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
      image: getFishImage("Tęczanka neonowa"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [25, 28], 
      biotope: "Austalia/Oceania",
      phRange: [6.5, 7.5], 
      hardness: [5, 15],
      temperament: "spokojne",
      minSchoolSize: 6,
      lifespan: "4-6 lat"
    },
    { 
      id: 13, 
      name: "Kirys pstry", 
      description: "Kirysek pstry to spokojna ryba, która lubi przebywać przy dnie akwarium i chować się między roślinami. Najlepiej czuje się w grupie, wtedy porusza się naturalnie i aktywnie.",
      image: getFishImage("Kirys pstry"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [23, 27], 
      biotope: "Ameryka Południowa",
      phRange: [6.0, 7.0], 
      hardness: [5, 15],
      temperament: "spokojne",
      minSchoolSize: 6,
      lifespan: "3-5 lat"
    },
    { 
      id: 14, 
      name: "Glonojad (Zbrojnik)", 
      description: "Glonojad / Zbrojnik to spokojna ryba, która pomaga utrzymać akwarium w czystości, zjadając glony z roślin i szybów. Lubi kryjówki i spokojne miejsca w zbiorniku. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
      image: getFishImage("Glonojad (Zbrojnik)"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [23, 28], 
      biotope: "Ameryka Południowa",
      phRange: [6.5, 7.5], 
      hardness: [1, 15],
      temperament: "spokojne",
      minSchoolSize: 1,
      lifespan: "3-7 lat"
    },
    { 
      id: 15, 
      name: "Błazenek pomarańczowy", 
      description: "Błazenek pomarańczowy to spokojna ryba, która najlepiej czuje się w parze. Lubi miejsca do ukrycia, np. między skałami lub wśród korali. Jest odporna, ale wymaga stabilnych warunków wody słonowodnej i odpowiedniej temperatury.",
      image: getFishImage("Błazenek pomarańczowy"), 
      waterType: "saltwater",
      waterTypeLabel: "Słona",
      tempRange: [25, 27], 
      biotope: "Azja",
      phRange: [7.8, 8.4], 
      hardness: [8, 25],
      temperament: "spokojne",
      minSchoolSize: 2,
      lifespan: "1 rok"
    },
    { 
      id: 16, 
      name: "Pirania czerwona", 
      description: "Pirania czerwona to agresywna ryba, która najlepiej żyje w grupie. Potrzebuje dużo miejsca do pływania i odpowiedniego akwarium, aby mogła wykazywać naturalne zachowania.",
      image: getFishImage("Pirania czerwona"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [25, 30], 
      biotope: "Ameryka Południowa",
      phRange: [6.0, 7.0], 
      hardness: [0, 18],
      temperament: "agresywne",
      minSchoolSize: 5,
      lifespan: "10-13 lat"
    },
    { 
      id: 17, 
      name: "Pokolec królewski", 
      description: "Pokolec królewski to spokojna ryba, która najlepiej trzymać pojedynczo. Lubi mieć miejsca do ukrycia, np. między skałami lub koralami. Jest odporna i może żyć długo w akwarium słonowodnym przy stabilnych warunkach wody.",
      image: getFishImage("Pokolec królewski"), 
      waterType: "saltwater",
      waterTypeLabel: "Słona",
      tempRange: [25, 27], 
      biotope: "Azja",
      phRange: [8.1, 8.5], 
      hardness: [8, 12],
      temperament: "spokojne",
      minSchoolSize: 1,
      lifespan: "8-12 lat"
    },
    { 
      id: 18, 
      name: "Proporczykowiec", 
      description: "Proporczykowiec to ryba pół-agresywna, która najlepiej czuje się w grupie. Lubi mieć kryjówki i miejsca do pływania. Może wykazywać dominujące zachowania wobec innych ryb, dlatego najlepiej trzymać ją z gatunkami o podobnym temperamencie.",
      image: getFishImage("Proporczykowiec"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [22, 26], 
      biotope: "Afryka",
      phRange: [6.0, 7.5], 
      hardness: [2, 10],
      temperament: "pół-agresywne",
      minSchoolSize: 4,
      lifespan: "10-15 lat"
    },
    { 
      id: 19, 
      name: "Pyszczak (Malawi)", 
      description: "Pyszczak (Malawi) to agresywna ryba, która najlepiej czuje się w swoim terytorium. Lubi mieć kryjówki i przestrzeń do pływania.",
      image: getFishImage("Pyszczak (Malawi)"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [25, 28], 
      biotope: "Afryka",
      phRange: [7.6, 8.8], 
      hardness: [10, 25],
      temperament: "agresywne",
      minSchoolSize: 1,
      lifespan: "8-10 lat"
    },
    { 
      id: 20, 
      name: "Księżniczka z Burundi", 
      description: "Księżniczka z Burundi to agresywna ryba, która najlepiej czuje się w grupie. Lubi mieć kryjówki i dużo miejsca do pływania.",
      image: getFishImage("Księżniczka z Burundi"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Afryka",
      phRange: [7.5, 9.0], 
      hardness: [9, 19],
      temperament: "agresywne",
      minSchoolSize: 6,
      lifespan: "5-10 lat"
    },
    { 
      id: 21, 
      name: "Kolcobrzuch karłowaty", 
      description: "Kolcobrzuch karłowaty to agresywna ryba, która najlepiej trzymać pojedynczo. Ma mocny charakter i potrafi bronić swojego terytorium. Lubi kryjówki i miejsca do ukrycia. Jest odporna, ale wymaga stabilnych warunków wody.",
      image: getFishImage("Kolcobrzuch karłowaty"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Azja",
      phRange: [6.8, 8.0], 
      hardness: [5, 25],
      temperament: "agresywne",
      minSchoolSize: 1,
      lifespan: "2-3 lata"
    },
    { 
      id: 22, 
      name: "Mandaryn wspaniały", 
      description: "Mandaryn wspaniały to spokojna ryba, która najlepiej trzymać pojedynczo. Lubi miejsca do ukrycia i rośliny lub koralowce, w których może się poruszać. Jest wrażliwa na warunki wody, dlatego wymaga stabilnego akwarium słonowodnego.",
      image: getFishImage("Mandaryn wspaniały"), 
      waterType: "saltwater",
      waterTypeLabel: "Słona",
      tempRange: [25, 27], 
      biotope: "Azja",
      phRange: [8.1, 8.4], 
      hardness: [4, 16],
      temperament: "spokojne",
      minSchoolSize: 1,
      lifespan: "4-5 lat"
    },
    { 
      id: 23, 
      name: "Ustnik słoneczny", 
      description: "Ustnik słoneczny to spokojna ryba, którą najlepiej trzymać pojedynczo. Lubi mieć miejsca do ukrycia, np. między skałami lub koralami. Jest odporna i może żyć długo w akwarium słonowodnym przy stabilnych warunkach wody.",
      image: getFishImage("Ustnik słoneczny"), 
      waterType: "saltwater",
      waterTypeLabel: "Słona",
      tempRange: [24, 27], 
      biotope: "Azja",
      phRange: [8.1, 8.3], 
      hardness: [5, 15],
      temperament: "spokojne",
      minSchoolSize: 1,
      lifespan: "8-10 lat"
    },
    { 
      id: 24, 
      name: "Babka złota", 
      description: "Babka złota to spokojna ryba, która najlepiej czuje się w grupie. Jest aktywna i lubi pływać wśród roślin oraz kryjówek. Jest odporna i łatwa w utrzymaniu, dobrze nadaje się do akwarium z innymi spokojnymi rybami.",
      image: getFishImage("Babka złota"), 
      waterType: "freshwater",
      waterTypeLabel: "Słodkowodna",
      tempRange: [24, 28], 
      biotope: "Azja",
      phRange: [7.0, 8.5], 
      hardness: [8, 20],
      temperament: "spokojne",
      minSchoolSize: 6,
      lifespan: "2-3 lata"
    },
  ];
  
  const [currentCard, setCurrentCard] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [waterFilter, setWaterFilter] = useState("all"); // all | freshwater | brackish | saltwater
  const [sortAggressiveness, setSortAggressiveness] = useState("none"); // none | asc | desc

  // Lista przefiltrowana i posortowana dla panelu
  const filteredFish = fishCards
    .filter((f) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery = q === "" || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q);
      const matchesWater = waterFilter === "all" || f.waterType === waterFilter;
      return matchesQuery && matchesWater;
    })
    .sort((a, b) => {
      if (sortAggressiveness === "asc") {
        const order = { "spokojne": 1, "pół-agresywne": 2, "umiarkowane": 3, "agresywne": 4, "bardzo agresywne": 5 };
        return (order[a.temperament] || 0) - (order[b.temperament] || 0);
      }
      if (sortAggressiveness === "desc") {
        const order = { "spokojne": 1, "pół-agresywne": 2, "umiarkowane": 3, "agresywne": 4, "bardzo agresywne": 5 };
        return (order[b.temperament] || 0) - (order[a.temperament] || 0);
      }
      return 0;
    });
  
  const handleNext = () => {
    setCurrentCard((prev) => (prev + 1) % fishCards.length);
  };
  
  const handlePrev = () => {
    setCurrentCard((prev) => (prev - 1 + fishCards.length) % fishCards.length);
  };
  
  // Funkcja do obliczania pozycji karty w karuzeli
  const getCardPosition = (index) => {
    const totalCards = fishCards.length;
    const offset = (index - currentCard + totalCards) % totalCards;
    
    // Na mobile: wyświetl tylko jedną kartę (główną)
    if (isMobile) {
      if (offset === 0) {
        return { zIndex: 3, scale: 1, translateX: 0, opacity: 1 }; // Tylko główna karta - wyśrodkowana
      } else {
        return { zIndex: 1, scale: 0.6, translateX: 0, opacity: 0 }; // Wszystkie inne ukryte
      }
    }
    
    // Na desktop: wyświetl 3 karty (główna + 2 boczne)
    // translateX w pikselach względem środka
    if (offset === 0) {
      return { zIndex: 3, scale: 1, translateX: 0, opacity: 1 }; // Karta główna (środek)
    } else if (offset === 1) {
      return { zIndex: 2, scale: 0.85, translateX: 180, opacity: 0.7 }; // Karta z prawej (tył)
    } else if (offset === totalCards - 1) {
      return { zIndex: 2, scale: 0.85, translateX: -180, opacity: 0.7 }; // Karta z lewej (tył)
    } else {
      return { zIndex: 1, scale: 0.6, translateX: 0, opacity: 0 }; // Pozostałe karty (ukryte)
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      position: "relative",
    }}>
      <video
      autoPlay
      loop
      muted
      playsInline
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0
      }}
    >
      <source src="/fishPage-bg.mp4" type="video/mp4" />
    </video>

      {/* Slide-out left panel: filters + list of all fish */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 80, md: 90 },
          bottom: { xs: 88, md: 0 },
          left: 0,
          width: { xs: 240, md: 300 },
          bgcolor: 'rgba(15, 25, 45, 0.80)',
          backdropFilter: 'blur(10px)',
          borderRight: '1px solid rgba(255,255,255,0.12)',
          zIndex: 9,
          transform: panelOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.35s ease',
          display: 'flex',
          flexDirection: 'column',
          pt: 2,
        }}
      >
        <Typography sx={{ color: 'white', px: 2.5, pb: 1.5, fontWeight: 600 }}>
          {t('allFish', { defaultValue: 'Wszystkie ryby' })}
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
        {/* Filters */}
        <Box sx={{ px: 2.5, pt: 1.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            placeholder={t('searchFish', { defaultValue: 'Szukaj ryb...' })}
            variant="outlined"
            InputProps={{ sx: { bgcolor: 'rgba(255,255,255,0.08)', color: 'white' } }}
          />
          <FormControl size="small">
            <InputLabel sx={{ color: 'white' }}>{t('waterType', { defaultValue: 'Typ wody' })}</InputLabel>
            <Select
              value={waterFilter}
              label={t('waterType', { defaultValue: 'Typ wody' })}
              onChange={(e) => setWaterFilter(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="all">{t('all', { defaultValue: 'Wszystkie' })}</MenuItem>
              <MenuItem value="freshwater">{t('freshwater', { defaultValue: 'Słodka' })}</MenuItem>
              <MenuItem value="brackish">{t('brackish', { defaultValue: 'Słonawa' })}</MenuItem>
              <MenuItem value="saltwater">{t('saltwater', { defaultValue: 'Słona' })}</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel sx={{ color: 'white' }}>{t('temperament', { defaultValue: 'Usposobienie' })}</InputLabel>
            <Select
              value={sortAggressiveness}
              label={t('temperament', { defaultValue: 'Usposobienie' })}
              onChange={(e) => setSortAggressiveness(e.target.value)}
              sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
            >
              <MenuItem value="none">{t('noSort', { defaultValue: 'Bez sortowania' })}</MenuItem>
              <MenuItem value="asc">{t('leastAggressive', { defaultValue: 'Najspokojniejsze' })}</MenuItem>
              <MenuItem value="desc">{t('mostAggressive', { defaultValue: 'Najagresywniejsze' })}</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.2)' }} />
        <Box sx={{ overflowY: 'auto' }}>
          <List>
            {filteredFish.map((fish) => (
              <ListItemButton
                key={fish.id}
                selected={fishCards[currentCard]?.id === fish.id}
                onClick={() => {
                  const idx = fishCards.findIndex((f) => f.id === fish.id);
                  if (idx >= 0) setCurrentCard(idx);
                  if (isMobile) setPanelOpen(false);
                }}
                sx={{
                  '&.Mui-selected': { bgcolor: 'rgba(255,255,255,0.12)' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' },
                }}
              >
                <ListItemText
                  primary={fish.name}
                  secondary={`${fish.waterTypeLabel} • ${getTemperamentLabel(fish.temperament)}`}
                  primaryTypographyProps={{ sx: { color: 'white', fontWeight: 600 } }}
                  secondaryTypographyProps={{ sx: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' } }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Box>

      {/* Panel toggle handle */}
      <Box
        sx={{
          position: 'fixed',
          left: panelOpen ? { xs: 240, md: 300 } : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 13,
        }}
      >
        <IconButton
          onClick={() => setPanelOpen((v) => !v)}
          sx={{
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            borderRadius: '0 20px 20px 0',
            '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
          }}
          aria-label={panelOpen ? t('close', { defaultValue: 'Zamknij' }) : t('open', { defaultValue: 'Otwórz' })}
        >
          {panelOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Top bar z przyciskami */}
      <Box sx={{ 
        position: 'absolute', top: 0, left: 0, right: 0,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        px: 4, py: 2, zIndex: 10
      }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          {/* Przycisk powrotu */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Box sx={{
              bgcolor: 'rgba(255, 255, 255, 0.4)', p: 0.8, borderRadius: 1.5, boxShadow: 2,
              transition: "all 0.3s", backdropFilter: 'blur(8px)',
              "&:hover": { boxShadow: 4, transform: "translateY(-2px)", bgcolor: 'rgba(255, 255, 255, 0.6)' },
              cursor: 'pointer', minHeight: '60px', minWidth: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
              <KeyboardReturnOutlinedIcon sx={{ fontSize: 16, mb: 0.3 }} />
              <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary", textAlign: 'center', fontSize: '0.65rem' }}>
                {t("return")}
              </Typography>
            </Box>
          </Link>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
        </Box>
      </Box>

      {/* Główna zawartość */}
      <Box sx={{ 
        position: "relative", 
        zIndex: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        pt: 14,
        pb: 4
      }}>
        {/* Karuzela kafelków - kontener flexbox wyśrodkowujący wszystko */}
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          minHeight: '800px',
          gap: 2
        }}>
          {/* Wewnętrzny kontener z większą szerokością dla kart */}
          <Box sx={{
            position: 'relative',
            width: { xs: '90%', md: '45%' },
            maxWidth: { xs: '100%', md: 400 },
            height: '800px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Renderuj wszystkie karty */}
            {fishCards.map((fish, index) => {
              const position = getCardPosition(index);
              return (
                <Box
                  key={fish.id}
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    top: '50%',
                    left: '50%',
                    transform: position.translateX === 0 
                      ? `translate(-50%, -50%) scale(${position.scale})`
                      : `translate(calc(-50% + ${position.translateX}px), -50%) scale(${position.scale})`,
                    transformOrigin: 'center center',
                    bgcolor: 'rgba(20, 30, 50, 0.95)',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    minHeight: '750px',
                    display: 'flex',
                    flexDirection: 'column',
                    zIndex: position.zIndex,
                    opacity: position.opacity,
                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: position.zIndex === 3 ? 'default' : 'pointer',
                    '&:hover': position.zIndex === 3 ? {} : {
                      opacity: 0.85,
                      transform: position.translateX === 0
                        ? `translate(-50%, -50%) scale(${position.scale * 1.05})`
                        : `translate(calc(-50% + ${position.translateX * 0.9}px), -50%) scale(${position.scale * 1.05})`
                    }
                  }}
                  onClick={() => position.zIndex !== 3 && setCurrentCard(index)}
                >
                {/* Strzałki nawigacyjne tylko na głównej karcie */}
                {position.zIndex === 3 && (
                  <Box sx={{
                    position: 'absolute',
                    top: 16,
                    left: 0,
                    right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: { xs: 1, md: 2 },
                    zIndex: 10
                  }}>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' }
                      }}
                    >
                      <ArrowBackIosIcon />
                    </IconButton>
                    <IconButton 
                      onClick={(e) => { e.stopPropagation(); handleNext(); }}
                      sx={{
                        color: 'white',
                        bgcolor: 'rgba(0, 0, 0, 0.4)',
                        '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.6)' }
                      }}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </Box>
                )}
                
                {/* Obraz ryby */}
                <Box sx={{
                  width: '100%',
                  height: '250px',
                  bgcolor: 'rgba(40, 60, 100, 0.8)',
                  backgroundImage: `url("${fish.image}")`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {/* Placeholder jeśli brak obrazu */}
                  {!fish.image && (
                    <Typography sx={{ color: 'white', opacity: 0.5 }}>
                      Image
                    </Typography>
                  )}
                </Box>

                {/* Treść kafelka */}
                <Box sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: 'white', 
                      mb: 1.5, 
                      fontWeight: 600 
                    }}
                  >
                    {fish.name}
                  </Typography>
                  
                  {/* Opis */}
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255, 255, 255, 0.8)',
                      lineHeight: 1.6,
                      mb: 2,
                      fontSize: '0.85rem'
                    }}
                  >
                    {fish.description}
                  </Typography>

                  {/* Parametry */}
                  <Box sx={{ mb: 2 }}>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mb: 1.5 }} />
                    
                    {/* Typ wody */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Typ wody:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.waterTypeLabel}
                      </Typography>
                    </Box>

                    {/* Temperatura */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Temperatura:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.tempRange[0]}-{fish.tempRange[1]} °C
                      </Typography>
                    </Box>

                    {/* Biotyp */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Biotyp:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.biotope}
                      </Typography>
                    </Box>

                    {/* pH */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        pH wody:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.phRange[0]}-{fish.phRange[1]}
                      </Typography>
                    </Box>

                    {/* Twardość */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Twardość:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.hardness[0]}-{fish.hardness[1]} °dGH
                      </Typography>
                    </Box>

                    {/* Usposobienie */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Usposobienie:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {getTemperamentLabel(fish.temperament)}
                      </Typography>
                    </Box>

                    {/* Ilość w stadzie */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Stado (min):
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.minSchoolSize} {fish.minSchoolSize === 1 ? 'sztuka' : 'sztuk'}
                      </Typography>
                    </Box>

                    {/* Długość życia */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.8rem' }}>
                        Długość życia:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'white', fontSize: '0.8rem', fontWeight: 500 }}>
                        {fish.lifespan}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', mt: 1.5 }} />
                  </Box>
                  
                  {/* Przycisk "Dodaj do akwarium" tylko na głównej karcie */}
                  {position.zIndex === 3 && (
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'center', 
                      mt: 'auto',
                      pt: 2
                    }}>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Dodano ${fish.name} do akwarium!`);
                        }}
                        variant="contained"
                        sx={{
                          bgcolor: '#FFD700',
                          color: '#000',
                          borderRadius: 3,
                          px: 4,
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          boxShadow: '0 4px 12px rgba(255, 215, 0, 0.3)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            bgcolor: '#FFC700',
                            boxShadow: '0 6px 16px rgba(255, 215, 0, 0.4)',
                            transform: 'translateY(-2px)'
                          },
                          '&:active': {
                            transform: 'translateY(0)'
                          }
                        }}
                      >
                        {t("addToAquarium", { defaultValue: "Add to Aquarium" })}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Box>
            );
          })}
          </Box>

          {/* Wskaźnik aktualnego kafelka - ukryty na mobile */}
          <Box sx={{
            display: { xs: 'none', md: 'flex' },
            justifyContent: 'center',
            gap: 1
          }}>
            {fishCards.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentCard ? 'white' : 'rgba(255, 255, 255, 0.4)',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

