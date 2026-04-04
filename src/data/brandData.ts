import type { BrandSection, ProductItem } from '../types';

export const brandSections: BrandSection[] = [
  {
    brand: 'Rick Owens',
    clusters: [
      {
        outfit: { id: 'ro1-o', brand: 'Rick Owens', name: 'Shirt, Trousers, and Boots', price: '$4,362', type: 'outfit', image: '/images/explore/ro1_fit.jpg', pieces: [
          { id: 'ro1-top', brand: 'Rick Owens', name: 'Lido Larry Shirt', price: '$992', type: 'product', image: '/images/explore/ro1_top.jpg' },
          { id: 'ro1-pants', brand: 'Rick Owens', name: 'Metallic-Effect Flared Trousers', price: '$1,095', type: 'product', image: '/images/explore/ro1_pants.jpg' },
          { id: 'ro1-shoes', brand: 'Rick Owens', name: 'Concordians Pull On Mega Tractor Boots', price: '$2,275', type: 'product', image: '/images/explore/ro1_shoes.jpg', images: ['/images/explore/ro1_shoes.jpg', '/images/explore/ro1_shoes_2.jpg', '/images/explore/ro1_shoes_3.jpg', '/images/explore/ro1_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'ro1-top', brand: 'Rick Owens', name: 'Lido Larry Shirt', price: '$992', type: 'product', image: '/images/explore/ro1_top.jpg' },
          { id: 'ro1-shoes', brand: 'Rick Owens', name: 'Mega Tractor Boots', price: '$2,275', type: 'product', image: '/images/explore/ro1_shoes.jpg', images: ['/images/explore/ro1_shoes.jpg', '/images/explore/ro1_shoes_2.jpg', '/images/explore/ro1_shoes_3.jpg', '/images/explore/ro1_shoes_4.jpg'] },
        ],
      },
      {
        outfit: { id: 'ro2-o', brand: 'Rick Owens', name: 'Jacket, T-Shirt, Jeans, and Sneaker', price: '$3,060', type: 'outfit', image: '/images/explore/ro2_fit.jpg', pieces: [
          { id: 'ro2-jacket', brand: 'Rick Owens', name: 'Leather Biker Jacket', price: '$1,320', type: 'product', image: '/images/explore/ro2_jacket.jpg' },
          { id: 'ro2-top', brand: 'Rick Owens', name: 'Short-Sleeve Crew-Neck T-Shirt', price: '$320', type: 'product', image: '/images/explore/ro2_top.jpg', images: ['/images/explore/ro2_top.jpg', '/images/explore/ro2_top_2.jpg'] },
          { id: 'ro2-pants', brand: 'Rick Owens', name: 'Bolan Jeans', price: '$1,170', type: 'product', image: '/images/explore/ro2_pants.jpg', images: ['/images/explore/ro2_pants.jpg', '/images/explore/ro2_pants_2.jpg'] },
          { id: 'ro2-shoes', brand: 'Rick Owens', name: 'Hollywood Jumbolace Sneakers', price: '$1,250', type: 'product', image: '/images/explore/ro2_shoes.jpg', images: ['/images/explore/ro2_shoes.jpg', '/images/explore/ro2_shoes_2.jpg', '/images/explore/ro2_shoes_3.jpg', '/images/explore/ro2_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'ro2-jacket', brand: 'Rick Owens', name: 'Leather Biker Jacket', price: '$1,320', type: 'product', image: '/images/explore/ro2_jacket.jpg' },
          { id: 'ro2-pants', brand: 'Rick Owens', name: 'Bolan Jeans', price: '$1,170', type: 'product', image: '/images/explore/ro2_pants.jpg', images: ['/images/explore/ro2_pants.jpg', '/images/explore/ro2_pants_2.jpg'] },
        ],
      },
    ],
  },
  {
    brand: 'BODE',
    clusters: [
      {
        outfit: { id: 'bo1-o', brand: 'BODE', name: 'Etro Coat, Eckhaus Latta Boots, BODE Shirt and Trousers', price: '$4,373', type: 'outfit', image: '/images/explore/bo1_fit.jpg', pieces: [
          { id: 'bo1-jacket', brand: 'Etro', name: 'Single-Breasted Coat', price: '$2,117', type: 'product', image: '/images/explore/bo1_jacket.jpg', images: ['/images/explore/bo1_jacket.jpg', '/images/explore/bo1_jacket_2.jpg'] },
          { id: 'bo1-top', brand: 'BODE', name: 'Glitter-Detail Shirt', price: '$686', type: 'product', image: '/images/explore/bo1_top.jpg' },
          { id: 'bo1-pants', brand: 'BODE', name: 'Glitter Trousers', price: '$835', type: 'product', image: '/images/explore/bo1_pants.jpg', images: ['/images/explore/bo1_pants.jpg', '/images/explore/bo1_pants_2.jpg'] },
          { id: 'bo1-shoes', brand: 'Eckhaus Latta', name: 'Mike Chelsea Boots', price: '$735', type: 'product', image: '/images/explore/bo1_shoes.jpg', images: ['/images/explore/bo1_shoes.jpg', '/images/explore/bo1_shoes_2.jpg', '/images/explore/bo1_shoes_3.jpg', '/images/explore/bo1_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'bo1-top', brand: 'BODE', name: 'Glitter-Detail Shirt', price: '$686', type: 'product', image: '/images/explore/bo1_top.jpg' },
          { id: 'bo1-shoes', brand: 'Eckhaus Latta', name: 'Mike Chelsea Boots', price: '$735', type: 'product', image: '/images/explore/bo1_shoes.jpg', images: ['/images/explore/bo1_shoes.jpg', '/images/explore/bo1_shoes_2.jpg', '/images/explore/bo1_shoes_3.jpg', '/images/explore/bo1_shoes_4.jpg'] },
        ],
      },
      {
        outfit: { id: 'bo2-o', brand: 'BODE', name: 'Wales Bonner Sneaker, BODE Jacket and Trousers', price: '$2,685', type: 'outfit', image: '/images/explore/bo2_fit.jpg', pieces: [
          { id: 'bo2-jacket', brand: 'BODE', name: 'Quilted Jacket', price: '$1,419', type: 'product', image: '/images/explore/bo2_jacket.jpg', images: ['/images/explore/bo2_jacket.jpg', '/images/explore/bo2_jacket_2.jpg'] },
          { id: 'bo2-top', brand: 'Nicholas Daley', name: 'Embroidered-Logo Sweatshirt', price: '$251', type: 'product', image: '/images/explore/bo2_top.jpg' },
          { id: 'bo2-pants', brand: 'BODE', name: 'Victorian Floral-Embroidered Trousers', price: '$1,015', type: 'product', image: '/images/explore/bo2_pants.jpg' },
          { id: 'bo2-shoes', brand: 'Wales Bonner', name: 'Adidas Originals Samba', price: '$200', type: 'product', image: '/images/explore/bo2_shoes.jpg', images: ['/images/explore/bo2_shoes.jpg', '/images/explore/bo2_shoes_2.jpg', '/images/explore/bo2_shoes_3.jpg', '/images/explore/bo2_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'bo2-shoes', brand: 'Wales Bonner', name: 'Adidas Originals Samba', price: '$200', type: 'product', image: '/images/explore/bo2_shoes.jpg', images: ['/images/explore/bo2_shoes.jpg', '/images/explore/bo2_shoes_2.jpg', '/images/explore/bo2_shoes_3.jpg', '/images/explore/bo2_shoes_4.jpg'] },
          { id: 'bo2-pants', brand: 'BODE', name: 'Victorian Floral Trousers', price: '$1,015', type: 'product', image: '/images/explore/bo2_pants.jpg' },
        ],
      },
    ],
  },
  {
    brand: 'Prada',
    clusters: [
      {
        outfit: { id: 'p1-o', brand: 'Prada', name: 'Marni T-Shirt, Prada Cardigan, Rick Owens Pants and Sneaker', price: '$9,659', type: 'outfit', image: '/images/explore/p1_fit.jpg', pieces: [
          { id: 'p1-jacket', brand: 'Prada', name: 'Faux-Fur Hooded Cardigan', price: '$6,200', type: 'product', image: '/images/explore/p1_jacket.jpg' },
          { id: 'p1-top', brand: 'Marni', name: 'Painted Baby Fawn T-Shirt', price: '$495', type: 'product', image: '/images/explore/p1_top.jpg' },
          { id: 'p1-pants', brand: 'Rick Owens', name: 'Cargobelas Wide-Leg Trousers', price: '$1,564', type: 'product', image: '/images/explore/p1_pants.jpg' },
          { id: 'p1-shoes', brand: 'Rick Owens', name: 'Hollywood Leather Sneakers', price: '$1,400', type: 'product', image: '/images/explore/p1_shoes.jpg', images: ['/images/explore/p1_shoes.jpg', '/images/explore/p1_shoes_2.jpg', '/images/explore/p1_shoes_3.jpg', '/images/explore/p1_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'p1-jacket', brand: 'Prada', name: 'Faux-Fur Hooded Cardigan', price: '$6,200', type: 'product', image: '/images/explore/p1_jacket.jpg' },
          { id: 'p1-top', brand: 'Marni', name: 'Painted Baby Fawn T-Shirt', price: '$495', type: 'product', image: '/images/explore/p1_top.jpg' },
        ],
      },
      {
        outfit: { id: 'p2-o', brand: 'Prada', name: 'Prada Shirt, Tom Ford Blazer, Trousers, and Slippers', price: '$4,728', type: 'outfit', image: '/images/explore/p2_fit.jpg', pieces: [
          { id: 'p2-jacket', brand: 'Tom Ford', name: 'Double-Breasted Blazer', price: '$995', type: 'product', image: '/images/explore/p2_jacket.jpg' },
          { id: 'p2-top', brand: 'Prada', name: 'Buttoned Cotton Shirt', price: '$995', type: 'product', image: '/images/explore/p2_top.jpg' },
          { id: 'p2-pants', brand: 'Tom Ford', name: 'Pleated Trousers', price: '$1,348', type: 'product', image: '/images/explore/p2_pants.jpg' },
          { id: 'p2-shoes', brand: 'Tom Ford', name: 'Sean Penny Loafers', price: '$1,390', type: 'product', image: '/images/explore/p2_shoes.jpg', images: ['/images/explore/p2_shoes.jpg', '/images/explore/p2_shoes_2.jpg', '/images/explore/p2_shoes_3.jpg', '/images/explore/p2_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'p2-top', brand: 'Prada', name: 'Buttoned Cotton Shirt', price: '$995', type: 'product', image: '/images/explore/p2_top.jpg' },
          { id: 'p2-shoes', brand: 'Tom Ford', name: 'Sean Penny Loafers', price: '$1,390', type: 'product', image: '/images/explore/p2_shoes.jpg', images: ['/images/explore/p2_shoes.jpg', '/images/explore/p2_shoes_2.jpg', '/images/explore/p2_shoes_3.jpg', '/images/explore/p2_shoes_4.jpg'] },
        ],
      },
    ],
  },
  {
    brand: 'We11done',
    clusters: [
      {
        outfit: { id: 'w1-o', brand: 'We11done', name: 'KidSuper Blazer, We11done Trousers, Heliot Emil Sneaker', price: '$1,994', type: 'outfit', image: '/images/explore/w1_fit.jpg', pieces: [
          { id: 'w1-jacket', brand: 'KidSuper', name: 'Embellished Faces Suit Top', price: '$525', type: 'product', image: '/images/explore/w1_jacket.jpg' },
          { id: 'w1-pants', brand: 'We11done', name: 'Drawstring Trousers', price: '$514', type: 'product', image: '/images/explore/w1_pants.jpg' },
          { id: 'w1-shoes', brand: 'Heliot Emil', name: 'Orma Boot Sneakers', price: '$955', type: 'product', image: '/images/explore/w1_shoes.jpg', images: ['/images/explore/w1_shoes.jpg', '/images/explore/w1_shoes_2.jpg', '/images/explore/w1_shoes_3.jpg', '/images/explore/w1_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'w1-jacket', brand: 'KidSuper', name: 'Embellished Faces Suit Top', price: '$525', type: 'product', image: '/images/explore/w1_jacket.jpg' },
          { id: 'w1-shoes', brand: 'Heliot Emil', name: 'Orma Boot Sneakers', price: '$955', type: 'product', image: '/images/explore/w1_shoes.jpg', images: ['/images/explore/w1_shoes.jpg', '/images/explore/w1_shoes_2.jpg', '/images/explore/w1_shoes_3.jpg', '/images/explore/w1_shoes_4.jpg'] },
        ],
      },
      {
        outfit: { id: 'w2-o', brand: 'We11done', name: 'We11done Bomber, Balenciaga Jeans, Jacquemus Slippers', price: '$4,080', type: 'outfit', image: '/images/explore/w2_fit.jpg', pieces: [
          { id: 'w2-jacket', brand: 'We11done', name: 'Gray Studded Hooded Bomber', price: '$795', type: 'product', image: '/images/explore/w2_jacket.jpg', images: ['/images/explore/w2_jacket.jpg', '/images/explore/w2_jacket_2.jpg', '/images/explore/w2_jacket_3.jpg'] },
          { id: 'w2-top', brand: 'Andersson Bell', name: 'Striped Panelled Shirt', price: '$397', type: 'product', image: '/images/explore/w2_top.jpg', images: ['/images/explore/w2_top.jpg', '/images/explore/w2_top_2.jpg', '/images/explore/w2_top_3.jpg'] },
          { id: 'w2-pants', brand: 'Balenciaga', name: 'Wide-Leg Jeans', price: '$2,028', type: 'product', image: '/images/explore/w2_pants.jpg', images: ['/images/explore/w2_pants.jpg', '/images/explore/w2_pants_2.jpg'] },
          { id: 'w2-shoes', brand: 'Jacquemus', name: "La Casa 'The Carre' Loafers", price: '$860', type: 'product', image: '/images/explore/w2_shoes.jpg', images: ['/images/explore/w2_shoes.jpg', '/images/explore/w2_shoes_2.jpg', '/images/explore/w2_shoes_3.jpg', '/images/explore/w2_shoes_4.jpg'] },
        ]},
        products: [
          { id: 'w2-jacket', brand: 'We11done', name: 'Studded Hooded Bomber', price: '$795', type: 'product', image: '/images/explore/w2_jacket.jpg', images: ['/images/explore/w2_jacket.jpg', '/images/explore/w2_jacket_2.jpg', '/images/explore/w2_jacket_3.jpg'] },
          { id: 'w2-top', brand: 'Andersson Bell', name: 'Striped Panelled Shirt', price: '$397', type: 'product', image: '/images/explore/w2_top.jpg', images: ['/images/explore/w2_top.jpg', '/images/explore/w2_top_2.jpg', '/images/explore/w2_top_3.jpg'] },
        ],
      },
    ],
  },
];

// Persona "For You" section — shown after quiz completion (deconstructionist persona)
export const personaSection: BrandSection = {
  brand: 'For You — Deconstructionist',
  clusters: [
    {
      outfit: {
        id: 'persona-comme-o', brand: 'COMME des GARÇONS', name: 'Ferrari Jacket, CDG Trousers, Bottega Veneta Boots', price: '$2,980', type: 'outfit',
        image: '/images/explore/persona/comme_fit.jpg',
        pieces: [
          { id: 'persona-comme-jacket', brand: 'Ferrari', name: 'Lambskin Bomber Jacket', price: '$1,170', type: 'product', image: '/images/explore/persona/comme_jacket.jpg', images: ['/images/explore/persona/comme_jacket.jpg', '/images/explore/persona/comme_jacket_2.jpg'] },
          { id: 'persona-comme-pants', brand: 'Comme des Garçons Homme', name: 'Patch-Pocket Cotton Trousers', price: '$210', type: 'product', image: '/images/explore/persona/comme_pants.jpg' },
          { id: 'persona-comme-shoes', brand: 'Bottega Veneta', name: 'Black Highway Chelsea Boots', price: '$1,600', type: 'product', image: '/images/explore/persona/comme_shoes.jpg', images: ['/images/explore/persona/comme_shoes.jpg', '/images/explore/persona/comme_shoes_2.jpg', '/images/explore/persona/comme_shoes_3.jpg', '/images/explore/persona/comme_shoes_4.jpg'] },
        ],
      },
      products: [
        { id: 'persona-comme-jacket', brand: 'Ferrari', name: 'Lambskin Bomber Jacket', price: '$1,170', type: 'product', image: '/images/explore/persona/comme_jacket.jpg', images: ['/images/explore/persona/comme_jacket.jpg', '/images/explore/persona/comme_jacket_2.jpg'] },
        { id: 'persona-comme-shoes', brand: 'Bottega Veneta', name: 'Highway Chelsea Boots', price: '$1,600', type: 'product', image: '/images/explore/persona/comme_shoes.jpg', images: ['/images/explore/persona/comme_shoes.jpg', '/images/explore/persona/comme_shoes_2.jpg', '/images/explore/persona/comme_shoes_3.jpg', '/images/explore/persona/comme_shoes_4.jpg'] },
      ],
    },
    {
      outfit: {
        id: 'persona-margiela-o', brand: 'Maison Margiela', name: 'Sweatshirt, Coat, Trousers, and Boots', price: '$4,200', type: 'outfit',
        image: '/images/explore/persona/margiela_fit.jpg',
        pieces: [],
      },
      products: [],
    },
    {
      outfit: {
        id: 'persona-ro-o', brand: 'Rick Owens DRKSHDW', name: 'Vest, Metallic Trousers, and Sneakers', price: '$3,800', type: 'outfit',
        image: '/images/explore/persona/ro_persona_fit.jpg',
        pieces: [],
      },
      products: [],
    },
  ],
};

// Flat list of all items for lookups (includes persona items)
const allSections = [...brandSections, personaSection];
export const allItems: ProductItem[] = allSections.flatMap(s =>
  s.clusters.flatMap(c => [c.outfit, ...c.products])
);

// Flat list of all individual products (pieces from outfits) for similar items
export const allPieces: ProductItem[] = allSections.flatMap(s =>
  s.clusters.flatMap(c => c.outfit.pieces || [])
);
