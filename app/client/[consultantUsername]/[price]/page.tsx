"use client";

import { useEffect, useState } from "react";

export default function CheckoutForm({
  params,
}: {
  params: { consultantUsername: string; price: string };
}) {
  const [data, setData] = useState({});
  const [consultantUsername, setConsultantUsername] = useState("");
  const [pricing, setPricing] = useState("");

  useEffect(() => {
    if (params?.consultantUsername && params?.price) {
      const username = decodeURIComponent(params.consultantUsername);
      const price = decodeURIComponent(params.price);
      setConsultantUsername(username);
      setPricing(price);
    }

    const storedData = sessionStorage.getItem("pendingData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, [params]);

  return <div>Checkout please</div>;
}
