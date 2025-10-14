import React from "react";
import {
  usePaymentKeys,
  useStripeConfig,
  usePayPalConfig,
} from "@/hooks/usePaymentKeys";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";

/**
 * Testing component to verify payment keys integration
 * This component shows the current status of payment keys from the store
 */
const PaymentKeysTestComponent: React.FC = () => {
  const paymentKeys = usePaymentKeys();
  const stripeConfig = useStripeConfig();
  const paypalConfig = usePayPalConfig();

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payment Keys Status</h2>
        <Button
          onClick={() => paymentKeys.refetch()}
          disabled={paymentKeys.isLoading}
          variant="outline"
          size="sm"
        >
          {paymentKeys.isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh Keys
        </Button>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {paymentKeys.isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Payment Keys...
              </>
            ) : paymentKeys.isReady ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                Payment Keys Ready
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                Payment Keys Not Available
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentKeys.error && (
            <Alert variant="destructive" className="mb-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{paymentKeys.error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Stripe Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">Stripe</h3>
                <Badge
                  variant={stripeConfig.isAvailable ? "default" : "secondary"}
                >
                  {stripeConfig.isAvailable ? "Available" : "Not Available"}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {stripeConfig.publishableKey ? (
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {stripeConfig.publishableKey.substring(0, 20)}...
                  </code>
                ) : (
                  <span className="text-red-500">No publishable key</span>
                )}
              </div>
            </div>

            {/* PayPal Status */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">PayPal</h3>
                <Badge
                  variant={paypalConfig.isAvailable ? "default" : "secondary"}
                >
                  {paypalConfig.isAvailable ? "Available" : "Not Available"}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {paypalConfig.clientId ? (
                  <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {paypalConfig.clientId.substring(0, 20)}...
                  </code>
                ) : (
                  <span className="text-red-500">No client ID</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Raw Data Display */}
      {paymentKeys.paymentKeysData && (
        <Card>
          <CardHeader>
            <CardTitle>Raw Payment Keys Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {JSON.stringify(paymentKeys.paymentKeysData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentKeysTestComponent;
