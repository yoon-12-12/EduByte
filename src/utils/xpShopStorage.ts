const STORAGE_KEY =
  "edubyte_shop";

export interface ShopData {
  themes: string[];
}

export function getShopData(): ShopData {
  const data =
    localStorage.getItem(STORAGE_KEY);

  return data
    ? JSON.parse(data)
    : {
        themes: ["default"],
      };
}

export function unlockTheme(
  theme: string
) {
  const data =
    getShopData();

  if (
    !data.themes.includes(theme)
  ) {
    data.themes.push(theme);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data)
  );
}

export function hasTheme(
  theme: string
) {
  return getShopData().themes.includes(
    theme
  );
}

export function clearShopInventory() {
  localStorage.removeItem(
     "edubyte_shop_inventory"
  );
}