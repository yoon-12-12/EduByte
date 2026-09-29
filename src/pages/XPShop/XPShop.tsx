import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/common/PageHeader";

import {
  getTotalXP,
  removeXP,
  addXPBooster,
} from "../../utils/quizStorage";

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  rarity: string;
}

const SHOP_STORAGE =
  "edubyte_shop_inventory";

const shopItems: ShopItem[] = [
  {
    id: 1,
    name: "🔥 XP 부스터",
    description:
      "열심히 공부한 당신의 상징",
    price: 100,
    rarity: "일반",
  },

  {
    id: 2,
    name: "⚡ 집중력 배지",
    description:
      "집중 학습 달성 기념",
    price: 300,
    rarity: "희귀",
  },

  {
    id: 3,
    name: "🏆 마스터 트로피",
    description:
      "고득점 학습자 전용",
    price: 700,
    rarity: "영웅",
  },

  {
    id: 4,
    name: "👑 전설 칭호",
    description:
      "최고 수준 학습자",
    price: 1500,
    rarity: "전설",
  },
];

export default function XPShop() {
  const [xp, setXP] =
    useState(0);

  const [inventory, setInventory] =
    useState<number[]>([]);

  useEffect(() => {
    setXP(getTotalXP());

    const saved =
      localStorage.getItem(
        SHOP_STORAGE
      );

    if (saved) {
      setInventory(
        JSON.parse(saved)
      );
    }
  }, []);

  const saveInventory = (
    nextInventory: number[]
  ) => {
    localStorage.setItem(
      SHOP_STORAGE,
      JSON.stringify(
        nextInventory
      )
    );

    setInventory(
      nextInventory
    );
  };

  const handleBuy = (
  item: ShopItem
) => {

  const isBooster =
    item.id === 1;

  if (
    !isBooster &&
    inventory.includes(
      item.id
    )
  ) {
    alert(
      "이미 보유 중인 아이템입니다."
    );
    return;
  }

  const currentXP =
    getTotalXP();

  if (
    currentXP < item.price
  ) {
    alert(
      "XP가 부족합니다."
    );
    return;
  }

  removeXP(item.price);

  if (item.id === 1) {
    addXPBooster();
  }

  const nextInventory =
    [...inventory, item.id];

  saveInventory(
    nextInventory
  );

  setXP(
    getTotalXP()
  );

  alert(
    `${item.name} 구매 완료`
  );
};

  const getOwnedCount = (
    itemId: number
  ) => {
    return inventory.filter(
      (id) => id === itemId
    ).length;
  };

  const getRarityColor = (
    rarity: string
  ) => {
    switch (rarity) {
      case "전설":
        return "text-yellow-500";

      case "영웅":
        return "text-purple-500";

      case "희귀":
        return "text-blue-500";

      default:
        return "text-green-500";
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">

        <PageHeader
          title="XP 상점"
          description="학습 XP로 다양한 아이템을 구매하세요."
        />

        <div
          className="
            bg-white
            dark:bg-slate-900

            rounded-xl
            border
            border-slate-200
            dark:border-slate-700

            p-6
          "
        >
          <h2
            className="
              text-2xl
              font-bold
            "
          >
            보유 XP
          </h2>

          <p
            className="
              text-4xl
              font-bold
              mt-4

              text-blue-600
            "
          >
            {xp}
          </p>
        </div>

        <div
          className="
            grid
            lg:grid-cols-2
            gap-5
          "
        >
          {shopItems.map(
            (item) => (
              <div
                key={item.id}
                className="
                  bg-white
                  dark:bg-slate-900

                  rounded-xl

                  border
                  border-slate-200
                  dark:border-slate-700

                  p-5
                "
              >
                <div className="flex justify-between">

                  <h2
                    className="
                      text-xl
                      font-bold
                    "
                  >
                    {item.name}
                  </h2>

                  <span
                    className={getRarityColor(
                      item.rarity
                    )}
                  >
                    {item.rarity}
                  </span>

                </div>

                <p
                  className="
                    mt-3
                    text-slate-600
                    dark:text-slate-400
                  "
                >
                  {item.description}
                </p>

                <div className="mt-4">

                  <p
                    className="
                      font-bold
                      text-blue-600
                    "
                  >
                    {item.price} XP
                  </p>

                  <p
                    className="
                      text-sm
                      mt-1
                    "
                  >
                    보유 :
                    {" "}
                    {getOwnedCount(
                      item.id
                    )}
                    개
                  </p>

                </div>

                <button
                  onClick={() =>
                    handleBuy(item)
                  }
                  disabled={
                    item.id !== 1 &&
                    inventory.includes(
                      item.id
                    )
                  }
                  className={`
                    mt-5
                    w-full
                    py-3
                    rounded-lg
                    text-white
                    font-semibold
                    transition-colors

                    ${
                      item.id !== 1 &&
                      inventory.includes(
                        item.id
                      )
                        ? "bg-slate-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {item.id !== 1 &&
                  inventory.includes(
                    item.id
                  )
                    ? "보유 중"
                    : "구매하기"}
                </button>

              </div>
            )
          )}
        </div>

      </div>
    </MainLayout>
  );
}