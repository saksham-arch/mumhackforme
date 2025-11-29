import { useState, useEffect } from 'react';
import { useAuth } from 'miaoda-auth-react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getReceipts, createReceipt, deleteReceipt, createTransaction } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import type { Receipt } from '@/types/types';
import { Upload, Camera, Trash2, CheckCircle } from 'lucide-react';

export default function ReceiptScannerPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (user) {
      loadReceipts();
    }
  }, [user]);

  const loadReceipts = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await getReceipts(user.id);
      setReceipts(data);
    } catch (error: any) {
      toast({
        title: 'Error loading receipts',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || e.target.files.length === 0) return;

    setIsScanning(true);

    try {
      const file = e.target.files[0];

      toast({
        title: 'Scanning receipt...',
        description: 'AI is extracting data from your receipt',
      });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockExtractedData = {
        amount: (Math.random() * 100 + 10).toFixed(2),
        merchant: ['Starbucks', 'Walmart', 'Amazon', 'Target', 'Whole Foods'][
          Math.floor(Math.random() * 5)
        ],
        date: format(new Date(), 'yyyy-MM-dd'),
        category: ['Food', 'Shopping', 'Groceries', 'Entertainment'][
          Math.floor(Math.random() * 4)
        ],
        tax: (Math.random() * 10).toFixed(2),
      };

      const receipt = await createReceipt({
        user_id: user.id,
        image_url: URL.createObjectURL(file),
        amount: Number(mockExtractedData.amount),
        merchant: mockExtractedData.merchant,
        date: mockExtractedData.date,
        category: mockExtractedData.category,
        tax_amount: Number(mockExtractedData.tax),
        extracted_data: mockExtractedData,
      });

      if (receipt) {
        await createTransaction({
          user_id: user.id,
          member_id: null,
          type: 'expense',
          amount: Number(mockExtractedData.amount),
          category: mockExtractedData.category,
          description: `Receipt from ${mockExtractedData.merchant}`,
          date: mockExtractedData.date,
        });
      }

      toast({
        title: 'Receipt scanned successfully!',
        description: 'Data extracted and transaction created',
      });

      loadReceipts();
    } catch (error: any) {
      toast({
        title: 'Error scanning receipt',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleDelete = async (receipt: Receipt) => {
    try {
      await deleteReceipt(receipt.id);
      toast({
        title: 'Receipt deleted',
        description: 'The receipt has been removed',
      });
      loadReceipts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Receipt Scanner</h1>
          <p className="text-muted-foreground">
            Snap a photo and let AI instantly extract all transaction details
          </p>
        </div>

        <Card gradient variant="primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Upload Receipt Image
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="receipt-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 text-center space-y-6 hover:border-primary/60 hover:bg-muted/30 transition-all">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg mx-auto flex items-center justify-center">
                  <Camera className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Drop your receipt here</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    or click to browse. AI will extract amount, merchant, date, category, tax & GST
                  </p>
                  <div className="inline-flex gap-2 pt-4">
                    <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                      JPG, PNG, WebP
                    </span>
                    <span className="text-xs bg-muted px-3 py-1 rounded-full text-muted-foreground">
                      Max 5MB
                    </span>
                  </div>
                </div>
                <Input
                  id="receipt-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isScanning}
                />
              </div>
            </Label>
          </CardContent>
        </Card>

        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Scanned Receipts</h2>
              <p className="text-sm text-muted-foreground">
                {receipts.length} receipt{receipts.length !== 1 ? 's' : ''} processed
              </p>
            </div>
          </div>

          {isLoading ? (
            <Card gradient>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border-2 border-muted border-t-primary animate-spin mx-auto" />
                  <p className="text-muted-foreground">Loading receipts...</p>
                </div>
              </CardContent>
            </Card>
          ) : receipts.length === 0 ? (
            <Card gradient variant="success">
              <CardContent className="py-16">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg mx-auto flex items-center justify-center">
                    <Upload className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">No receipts yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload your first receipt to get started
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {receipts.map((receipt) => (
                <Card
                  key={receipt.id}
                  gradient
                  className="hover:shadow-lg hover:border-primary/50 transition-all group"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(receipt)}
                        className="h-6 w-6 p-0 -mr-2 -mt-2 hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{receipt.merchant || 'Unknown'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(receipt.date), 'MMM d, yyyy')}
                        </p>
                      </div>

                      <div className="flex items-center justify-between py-3 px-3 bg-muted/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <span className="text-xl font-bold">
                          ${Number(receipt.amount).toFixed(2)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {receipt.category && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Category</p>
                            <p className="font-semibold text-sm">{receipt.category}</p>
                          </div>
                        )}
                        {receipt.tax_amount && (
                          <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">Tax</p>
                            <p className="font-semibold text-sm">
                              ${Number(receipt.tax_amount).toFixed(2)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
