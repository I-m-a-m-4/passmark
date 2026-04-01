"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CreditCard,
  Zap,
  ShieldCheck,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    name: "Scholar Access",
    price: "₦200",
    features: [
      "Access to all Course Files",
      "Unlimited Downloads",
      "Neural Search Integration",
      "Verified Material Access",
      "Lattice Registry Entry",
    ],
    current: false,
    recommended: true,
  },
];

export default function BillingPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Lattice Credits
        </h1>
        <p className="text-muted-foreground">
          Manage your subscription protocol and credit allocation.
        </p>
      </div>

      <div className="flex justify-center">
        {PLANS.map((plan, i) => (
          <Card
            key={i}
            className={`bg-card md:w-[400px] backdrop-blur-sm transition-all overflow-hidden relative border ${plan.recommended ? "border-emerald-500 ring-4 ring-emerald-500/10" : "border-white/5 shadow-xl"}`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[8px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-bl-xl shadow-lg">
                Recommended
              </div>
            )}
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl text-foreground dark:text-white font-bold">
                {plan.name}
              </CardTitle>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold tracking-tight text-foreground dark:text-white font-headline">
                  {plan.price}
                </span>
                <span className="ml-1 text-xs text-muted-foreground font-medium">
                  /semester
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-8 pt-4 space-y-8">
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-3 text-xs font-bold text-zinc-900 dark:text-zinc-300"
                  >
                    <div className="bg-emerald-500/10 p-1 rounded-full">
                      <Check className="h-3 w-3 text-emerald-500" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full font-bold h-12 rounded-xl uppercase text-[10px] tracking-[0.2em] ${plan.current ? "bg-zinc-800 text-zinc-400 cursor-default" : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"}`}
                disabled={plan.current}
              >
                {plan.current ? "Current Protocol" : "Upgrade Token"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
}
