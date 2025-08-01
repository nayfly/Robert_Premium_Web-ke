import "server-only"

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
}

export const getDictionary = async (locale: "es" | "en") => {
  try {
    const dictionary = await dictionaries[locale]?.()

    if (!dictionary) {
      console.warn(`Dictionary not found for locale: ${locale}, falling back to 'es'`)
      return await dictionaries.es()
    }

    return dictionary
  } catch (error) {
    console.error(`Error loading dictionary for locale: ${locale}`, error)
    // Fallback a español
    return await dictionaries.es()
  }
}
