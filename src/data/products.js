// Product catalog — bonus per unit sold (₪)
export const PRODUCTS = [

  { id: 'sofiderm_05',            name: ' סופידרם 0.5CC',                     bonus: 3   },
  { id: 'mazrek_200',             name: 'מזרק סופידרם חצי ב200',             bonus: 10  },
  { id: 'sofiderm',               name: 'סופידרם 1CC',                        bonus: 8   },
  { id: 'package_sofiderm_3',     name: 'חבילת 3 סופידרם',                    bonus: 24  },
  { id: 'package_sofiderm_6',     name: 'חבילת 6 סופידרם',                    bonus: 98  },
  { id: 'package_sofiderm_9',     name: 'חבילת 9 סופידרם',                    bonus: 172 },
  { id: 'package_sofiderm_10',    name: 'חבילת 10 סופידרם',                   bonus: 180 },
  { id: 'package_sofiderm_12',    name: 'חבילת 12 סופידרם',                   bonus: 246 },
  { id: 'package_sofiderm_12',    name: 'חבילת 20 סופידרם',                   bonus: 0 },
  { id: 'package_premium',        name: 'חבילת PREMIUM',                       bonus: 170 },
  { id: 'package_vip',            name: 'חבילת VIP',                           bonus: 270 },
  { id: 'package_gold',           name: 'חבילת gold',                          bonus: 500 },
  { id: 'package_diamond',        name: 'חבילת diamond',                       bonus: 1000 },
  { id: 'skin_booster_face',      name: 'סקין בוסטר',                          bonus: 60  },
  { id: 'skin_booster_neck',      name: 'סקין בוסטר צוואר',                    bonus: 60  },
  { id: 'sculptra',               name: 'סקולפטרה',                            bonus: 50  },
  { id: 'sibal_vivyon',           name: 'סיבל ויזן (0.5/1)',                   bonus: 30  },
  { id: 'sofi_salmon_1ml',        name: 'סופי סלמון 1CC',                      bonus: 30  },
  { id: 'sofi_salmon_3ml',        name: 'סופי סלמון 3CC',                      bonus: 40  },
  { id: 'elasti',                 name: 'אלסטי 1CC',                           bonus: 5   },
  { id: 'package_elesti_3',       name: 'חבילת 3 אלסטי',                       bonus: 15  },
  { id: 'package_elesti_6',       name: 'חבילת 6 אלסטי',                       bonus: 80  },
  { id: 'package_elesti_9',       name: 'חבילת 9 אלסטי',                       bonus: 145 },
  { id: 'package_elesti_12',      name: 'חבילת 12 אלסטי',                      bonus: 210 },
  { id: 'hatsi_sibal_focus',      name: 'חצי סיבל פוקוס',                      bonus: 3   },
  { id: 'juvederm_smile_05',      name: 'גובידרם סמייל 0.5',                   bonus: 3   },
  { id: 'juvederm_3',             name: 'גובידרם 3',                            bonus: 3   },
  { id: 'lips_stylage',           name: "סטילאז LIPS",                          bonus: 3   },
  { id: 'rinstyl',                name: 'רדנסיטי',                              bonus: 6   },

]

export function unitBonus(product) {
  return product.bonus
}
