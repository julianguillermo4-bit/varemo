const copy = {
  es: {
    from: 'Desde', quote: 'A cotizar', assessment: 'Según evaluación', reference: 'Precio de apertura',
    review: {
      method: 'Revisión previa',
      description: 'El barro grueso o la arena necesitan limpieza previa. Primero debemos confirmar un lugar donde se pueda realizar el proceso adecuado.',
      note: 'No recomendamos pasar directamente al lavado sin agua en estas condiciones. Debemos evaluar el auto y el espacio.'
    },
    heavy: {
      method: 'Con agua, previa evaluación',
      description: 'Un lavado con enjuague puede ser el punto de partida. La suciedad intensa puede necesitar un trabajo adicional que se cotiza antes.',
      note: 'Confirmaremos el estado del auto, el trabajo necesario y las condiciones de drenaje antes de coordinar.'
    },
    water: {
      method: 'Lavado con agua',
      description: 'Con un área permitida y acceso al agua, el lavado con enjuague es una opción para la suciedad de uso diario.',
      note: 'La elección final depende de la revisión del auto y de las condiciones del lugar.'
    },
    checkWaterless: {
      method: 'Sin agua, previa revisión',
      description: 'Puede funcionar si la suciedad es compatible con el producto y el método. Primero revisamos que no haya partículas gruesas o suciedad muy adherida.',
      note: 'Si el estado del auto exige un prelavado, habrá que coordinar otra solución antes de comenzar.'
    },
    light: {
      method: 'Lavado sin agua',
      description: 'Una opción para mantener tu auto limpio cuando tiene polvo y suciedad ligera, sin enjuagar la carrocería con manguera.',
      note: 'Confirmaremos el estado del auto, la autorización de acceso y la electricidad necesaria para el aspirado.'
    },
    names: {
      vehicle: {sedan: 'Sedán / hatchback', suv: 'SUV', otro: 'Otro tipo de vehículo'},
      dirt: {ligera: 'Polvo y suciedad ligera', moderada: 'Suciedad moderada de uso diario', intensa: 'Barro, arena o mucha suciedad'},
      water: {'por-confirmar': 'Debo confirmar las condiciones del lugar', si: 'Sí, con agua y drenaje adecuados', no: 'El espacio tiene restricciones de agua'}
    },
    greeting: 'Hola, Varemo. Me interesa su próximo lanzamiento en Costa del Este.',
    labels: {vehicle: 'Vehículo', dirt: 'Suciedad', water: 'Uso de agua', method: 'Orientación inicial', price: 'Precio orientativo'},
    unknown: 'Por confirmar',
    ending: 'Quisiera conocer la propuesta y consultar el método y el precio orientativo. Entiendo que todavía no se confirman reservas.'
  },
  en: {
    from: 'From', quote: 'Quote required', assessment: 'After assessment', reference: 'Launch price',
    review: {
      method: 'Assessment needed first',
      description: 'Heavy mud or sand require pre-cleaning. First, we need to confirm a location where the appropriate process can be carried out.',
      note: 'We do not recommend going straight to a waterless wash in these conditions. We need to assess the car and the space.'
    },
    heavy: {
      method: 'With water, after assessment',
      description: 'A wash with rinsing may be the starting point. Heavy dirt may need additional work, which we quote before starting.',
      note: 'We will confirm the car’s condition, the work needed and drainage arrangements before scheduling.'
    },
    water: {
      method: 'Wash with water',
      description: 'With an approved area and access to water, a wash with rinsing is an option for everyday dirt.',
      note: 'The final choice depends on the car’s condition and the site requirements.'
    },
    checkWaterless: {
      method: 'Waterless, after a check',
      description: 'This may work if the dirt is suitable for the product and method. First, we check for coarse particles or stubborn dirt.',
      note: 'If the car needs pre-cleaning, we will need to arrange an alternative before starting.'
    },
    light: {
      method: 'Waterless wash',
      description: 'An option for keeping your car clean when it has dust and light dirt, without rinsing the bodywork with a hose.',
      note: 'We will confirm the car’s condition, access permission and any electricity needed for vacuuming.'
    },
    names: {
      vehicle: {sedan: 'Sedan / hatchback', suv: 'SUV', otro: 'Other vehicle type'},
      dirt: {ligera: 'Dust and light dirt', moderada: 'Moderate everyday dirt', intensa: 'Mud, sand or heavy dirt'},
      water: {'por-confirmar': 'I need to confirm the site conditions', si: 'Yes, with suitable water supply and drainage', no: 'The space has water restrictions'}
    },
    greeting: 'Hi, Varemo. I am interested in your upcoming launch in Costa del Este.',
    labels: {vehicle: 'Vehicle', dirt: 'Dirt level', water: 'Water use', method: 'Initial guidance', price: 'Reference price'},
    unknown: 'To be confirmed',
    ending: 'I would like to learn about the service, method and reference price. I understand that bookings are not being confirmed yet.'
  }
};

export function recommendService(vehicle, dirt, water, prices = { sedan: 25, suv: 30 }, language = 'es') {
  const text = copy[language] ?? copy.es;
  const needsReview = dirt === 'intensa';
  let recommendation;
  if (needsReview && water !== 'si') recommendation = text.review;
  else if (needsReview) recommendation = text.heavy;
  else if (dirt === 'moderada' && water === 'si') recommendation = text.water;
  else if (dirt === 'moderada') recommendation = text.checkWaterless;
  else recommendation = text.light;
  const knownVehicle = Object.hasOwn(prices, vehicle);
  const quoteRequired = needsReview || !knownVehicle;
  return {
    ...recommendation,
    quoteRequired,
    price: quoteRequired ? text.quote : `${text.from} $${prices[vehicle]}`,
    priceLabel: quoteRequired ? text.assessment : text.reference
  };
}

export function buildSummary({ vehicle, dirt, water, result }, language = 'es') {
  const text = copy[language] ?? copy.es;
  return `${text.greeting}\n\n${text.labels.vehicle}: ${text.names.vehicle[vehicle] || text.unknown}.\n${text.labels.dirt}: ${text.names.dirt[dirt] || text.unknown}.\n${text.labels.water}: ${text.names.water[water] || text.unknown}.\n${text.labels.method}: ${result.method}.\n${result.quoteRequired ? text.labels.price : text.reference}: ${result.price}.\n\n${text.ending}`;
}
