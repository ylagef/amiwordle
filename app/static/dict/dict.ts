import animals from "./animals_5";
import cities from "./cities_5";
import countries from "./countries_5";
import names_common from "./names_common_5";
import names_female from "./names_female_5";
import names_male from "./names_male_5";
import rae from "./rae_5";
import rae_corpus from "./rae_corpus_5";
import rae_corpus_full from "./rae_corpus_full_5";

const custom: string[] = ["yeray", "buffi", "yaiza", "tania"];

const dict: string[] = [
  ...new Set([
    ...custom,
    ...rae,
    ...names_common,
    ...names_male,
    ...names_female,
    ...cities,
    ...countries,
    ...animals,
    ...rae_corpus,
    ...rae_corpus_full,
  ]),
];

export default dict;
