const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      name: 'Urban Classic Black',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80',
      descripcion: 'Zapatillas urbanas clásicas en color negro, perfectas para el día a día.',
      sizes: '7,8,9,10,11,12'
    },
    {
      name: 'Sport White',
      price: 94.99,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=812&q=80',
      descripcion: 'Zapatillas deportivas en blanco.',
      sizes: '6,7,8,9,10,11'
    },
    {
      name: 'Black Pro',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1605030753481-bb38b08c384a?ixlib=rb-4.0.3&auto=format&fit=crop&w=749&q=80',
      descripcion: 'Edición profesional en negro con refuerzos estratégicos.',
      sizes: '8,9,10,11,12,13'
    },
    {
      name: 'Red Street',
      price: 87.99,
      image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80',
      descripcion: 'Zapatillas urbanas en rojo vibrante para destacar tu estilo.',
      sizes: '7,8,9,10,11'
    }
  ];

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.descripcion,
        sizes: product.sizes
      }
    });
  }

  const services = [
    { name: 'Cambio de suela', description: 'Reemplazo completo de la suela desgastada', price: 25.00 },
    { name: 'Reparación de costuras', description: 'Arreglo de costuras rotas o desgastadas', price: 15.00 },
    { name: 'Reemplazo de cordones', description: 'Cambio de cordones por unos nuevos', price: 8.00 },
    { name: 'Limpieza profunda', description: 'Limpieza completa y restauración de color', price: 12.00 },
    { name: 'Reparación de cremallera', description: 'Arreglo o reemplazo de cremallera dañada', price: 18.00 },
    { name: 'Refuerzo de talón', description: 'Refuerzo interno para mayor durabilidad', price: 10.00 }
  ];

  for (const svc of services) {
    await prisma.repairService.create({
      data: svc
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
