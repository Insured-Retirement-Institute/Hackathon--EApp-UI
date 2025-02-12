import { PricingRequestModel } from "../services/pricing.api";

export const PricingModelMock: PricingRequestModel = {
    "requestorName": "Andrew Overton",
    "allocations": [
      {
        "assetClass": "Stock",
        "assetDisplayName": "Tesla",
        "assetId": "TSLA",
        "allocationPercentage": 50
      },
      {
        "assetClass": "Stock",
        "assetDisplayName": "Nvidia",
        "assetId": "NVDA",
        "allocationPercentage": 50
      }
    ],
    "Reason": "I chose the following stocks because you displayed a strong interest in the technology field, and these two options have historically performed well."
  };