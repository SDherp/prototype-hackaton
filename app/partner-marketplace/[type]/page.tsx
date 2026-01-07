import { notFound } from "next/navigation"
import { PartnerMarketplaceContent, emissionTypes } from "@/app/partner-marketplace/marketplace-content"

export const dynamicParams = false

export function generateStaticParams() {
  return emissionTypes.map((type) => ({ type: type.id }))
}

type PageProps = {
  params: {
    type: string
  }
}

export default function PartnerMarketplacePage({ params }: PageProps) {
  const activeType = emissionTypes.find((type) => type.id === params.type)

  if (!activeType) {
    notFound()
  }

  return <PartnerMarketplaceContent activeTypeId={activeType.id} />
}
