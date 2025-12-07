const products = [
  {
    id: 1,
    name: 'Jerssey de Fútbol Mbappe local Real Madrid',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/mbappe-blanca.jpg',
      process.env.PUBLIC_URL + '/images/mbappe-10-blanca.jpg',
      process.env.PUBLIC_URL + '/images/champions-madrid.jpg',
      process.env.PUBLIC_URL + '/images/real-madrid-back.jpg'
    ],
    price: 20,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'Jerssey de Fútbol Valverde local Real Madrid',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/valverde-blanca.jpg',
      process.env.PUBLIC_URL + '/images/champions-madrid.jpg',
      process.env.PUBLIC_URL + '/images/champions-madrid.jpg',
      process.env.PUBLIC_URL + '/images/valverde-back.jpg'
    ],
    price: 20,
    sizes: [ 'L']
  },
  {
    id: 3,
    name: 'Jerssey de Fútbol Mbappe tercera equipacion Real Madrid',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/numero-mbappe-azul.jpg',
      process.env.PUBLIC_URL + '/images/champions-azul.jpg',
      process.env.PUBLIC_URL + '/images/HPazul.jpg',
      process.env.PUBLIC_URL + '/images/numero-mbappe-azul.jpg'
    ],
    price: 20,
    sizes: []
  },
  {
    id: 4,
    name: 'Jerssey de Fútbol Lamine Yamal local',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/lamine-azulgrana.jpg',
      process.env.PUBLIC_URL + '/images/barca-10.jpg',
      process.env.PUBLIC_URL + '/images/lamine-10.jpg',
      process.env.PUBLIC_URL + '/images/champions-barca.jpg'
    ],
    price: 20,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 5,
    name: 'Jerssey de Fútbol Lamine Yamal segunda equipacion',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/lamine-beige.jpg',
      process.env.PUBLIC_URL + '/images/barca-beige.jpg',
      process.env.PUBLIC_URL + '/images/real-madrid-3.jpg',
      process.env.PUBLIC_URL + '/images/lamine-segunda-back.jpg'
    ],
    price: 20,
    sizes: [ 'L']
  },
  {
    id: 6,
    name: 'Jerssey de Fútbol Pedri local',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/pedri-azulgrana.jpg',
      process.env.PUBLIC_URL + '/images/barca-10.jpg',
      process.env.PUBLIC_URL + '/images/champions-barca.jpg',
      process.env.PUBLIC_URL + '/images/pedri-back.jpg'
    ],
    price: 20,
    sizes: [ 'M','L']
  },
  {
    id: 7,
    name: 'Jerssey de Fútbol Musiala alemania',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/musiala-alemania.jpg',
      process.env.PUBLIC_URL + '/images/musiala.jpg',
      process.env.PUBLIC_URL + '/images/real-madrid-3.jpg',
      process.env.PUBLIC_URL + '/images/musiala-back.jpg'
    ],
    price: 20,
    sizes: ['XL']
  },
  {
    id: 8,
    name: 'Jerssey de Fútbol Salah Liverpool',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/salah.jpg',
      process.env.PUBLIC_URL + '/images/salah-11.jpg',
      process.env.PUBLIC_URL + '/images/logoPL-liverpool.jpg',
      process.env.PUBLIC_URL + '/images/liverpool11.jpg'
    ],
    price: 20,
    sizes: ['L']
  },
  {
    id: 9,
    name: 'Jerssey de Fútbol Cristiano Ronaldo United',
    category: 'futbol',
    images: [
      process.env.PUBLIC_URL + '/images/ronaldo-united.jpg',
      process.env.PUBLIC_URL + '/images/real-madrid-2.jpg',
      process.env.PUBLIC_URL + '/images/real-madrid-3.jpg',
      process.env.PUBLIC_URL + '/images/ronaldo-back.jpg'
    ],
    price: 25,
    sizes: [ 'L' ]
  },
  {
    id: 10,
    name: 'Juego Niño Lamine barcelona local ',
    category: 'futbol',
    kids: true,
    images: [
      process.env.PUBLIC_URL + '/images/barca-niño.jpg',
      process.env.PUBLIC_URL + '/images/short-barca.jpg',
      process.env.PUBLIC_URL + '/images/barcelona-niño.jpg',
      process.env.PUBLIC_URL + '/images/barca10.jpg'
    ],
    price: 20,
    sizes: ['10']
  },
  {
    id: 11,
    name: 'Juego de niño Mbappe Real Madrid',
    category: 'futbol',
    kids: true,
    images: [
      process.env.PUBLIC_URL + '/images/madrid-niño.jpg',
      process.env.PUBLIC_URL + '/images/short-madrif.jpg',
      process.env.PUBLIC_URL + '/images/real-madrid-3.jpg',
      process.env.PUBLIC_URL + '/images/madrid-niño-back.jpg'
    ],
    price: 20,
    sizes: []
  },
  {
    id: 12,
    name: 'Jerssey Lebron Lakers',
    category: 'basket',
    images: [
      process.env.PUBLIC_URL + '/images/lebron-amarilla.jpg',
      process.env.PUBLIC_URL + '/images/lebron.jpg',
      process.env.PUBLIC_URL + '/images/lebron-front.jpg',
      process.env.PUBLIC_URL + '/images/lebron-back.jpg'
    ],
    price: 13,
    sizes: ['S']
  },
  {
    id: 14,
    name: 'Jerssey Curry Warriors',
    category: 'basket',
    images: [
      process.env.PUBLIC_URL + '/images/curry-blanca.jpg',
      process.env.PUBLIC_URL + '/images/curry-numero.jpg',
      process.env.PUBLIC_URL + '/images/GSW.jpg',
      process.env.PUBLIC_URL + '/images/logoNBA.jpg'
    ],
    price: 13,
    sizes: ['L']
  },
  {
    id: 15,
    name: 'Camiseta Béisbol Ohtani Dodgers Blanca',
    category: 'beisbol',
    images: [
      process.env.PUBLIC_URL + '/images/othani-blanca.jpg',
      process.env.PUBLIC_URL + '/images/ohtani17-blanca.jpg',
      process.env.PUBLIC_URL + '/images/dodgers17-blanca.jpg',
      process.env.PUBLIC_URL + '/images/etiquetaMLB-blanca.jpg'
    ],
    price: 25,
    sizes: [ 'XL']
  },
  {
    id: 17,
    name: 'Camiseta Béisbol Ohtani Dodgers Azul',
    category: 'beisbol',
    images: [
      process.env.PUBLIC_URL + '/images/othani-azul.jpg',
      process.env.PUBLIC_URL + '/images/othani-azul.jpg',
      process.env.PUBLIC_URL + '/images/othani-azul-front.jpg',
      process.env.PUBLIC_URL + '/images/othani-azul-back.jpg'
    ],
    price: 25,
    sizes: [ ]
  },
  {
    id: 16,
    name: 'Camiseta Béisbol Tatis JR Padres Negra',
    category: 'beisbol',
    images: [
      process.env.PUBLIC_URL + '/images/tatis-negra.jpg',
      process.env.PUBLIC_URL + '/images/tatis23.jpg',
      process.env.PUBLIC_URL + '/images/sandiego.jpg',
      process.env.PUBLIC_URL + '/images/logoMLB-negra.jpg'
    ],
    price: 25,
    sizes: [ 'L']
  }
];

export default products;
