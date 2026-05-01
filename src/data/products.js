// Product catalog — bonus per unit sold (₪)
export const PRODUCTS = [
  { id: 'hatsi_sibal_focus',   name: 'חצי סיבל פוקוס',             bonus: 3   },
  { id: 'juvederm_smile_05',   name: 'גובידרם סמייל 0.5',           bonus: 3   },
  { id: 'juvederm_3',          name: 'גובידרם 3',                   bonus: 3   },
  { id: 'lips_stylage',        name: "סטילאז LIPS",                bonus: 3   },
  { id: 'superderm_05',        name: ' סופידרם 0.5CC',             bonus: 3   },
  { id: 'mazrek_200_3cc',      name: 'מזרק סופידרם חצי ב200',    bonus: 10  },
  { id: 'superim',             name: 'סופידרם',                      bonus: 8   },
  { id: 'rinstyl',             name: 'רדנסיטי',                     bonus: 6   },
  { id: 'elasti_f',            name: 'אלסטי F',                     bonus: 5   },
  { id: 'elasti_g',            name: 'אלסטי G',                     bonus: 5   },
  { id: 'elasti_d',            name: 'אלסטי D',                     bonus: 5   },
  { id: 'sibal_vivyon',        name: 'סיבל ויזן (0.5/1)',         bonus: 30  },
  { id: 'sofi_salmon_1ml',     name: 'סופי סלמון 1CC',             bonus: 30  },
  { id: 'sofi_salmon_3ml',     name: 'סופי סלמון 3CC',             bonus: 40  },
  { id: 'sculptra',            name: 'סקולפטרה',                    bonus: 50  },
  { id: 'skin_booster_5ml',    name: 'סקין בוסטר',             bonus: 60  },
  { id: 'package_vip',         name: 'חבילת VIP',                   bonus: 270 },
  { id: 'package_premium',     name: 'חבילת PREMIUM',               bonus: 170 },
  { id: 'package_superderm_3', name: 'חבילת 3 סופרידרם',            bonus: 24  },
  { id: 'package_superderm_6', name: 'חבילת 6 סופרידרם',            bonus: 98  },
  { id: 'package_superderm_9', name: 'חבילת 9 סופרידרם',            bonus: 172 },
  { id: 'package_superderm_10cc', name: 'חבילת 10 סופידרם',     bonus: 180 },
  { id: 'package_superderm_12',name: 'חבילת 12 סופרידרם',           bonus: 246 },
  { id: 'hatsi_sibal_focus',   name: 'חצי סיבל פוקוס',             bonus: 3   },
  { id: 'juvederm_smile_05',   name: 'גובידרם סמייל 0.5',           bonus: 3   },
  { id: 'juvederm_3',          name: 'גובידרם 3',                   bonus: 3   },
  { id: 'lips_stylage',        name: "סטילאז LIPS",                bonus: 3   },
  { id: 'rinstyl',             name: 'רדנסיטי',                     bonus: 6   },

]

export function unitBonus(product) {
  return product.bonus
}
