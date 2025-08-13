
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, Swords, Target } from "lucide-react";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

interface CreateChallengeDialogProps {
  gameType: "pool" | "chess";
  onCreate: (prize: number, fee: number) => void;
}

export function CreateChallengeDialog({ gameType, onCreate }: CreateChallengeDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prize, setPrize] = useState(100);
  const [fee, setFee] = useState(10);
  const { spendShot } = useStore();
  const { toast } = useToast();

  const handleCreate = () => {
    if (prize <= fee) {
      toast({
        variant: "destructive",
        title: "Invalid Challenge",
        description: "The prize must be greater than the entry fee.",
      });
      return;
    }
    if (!spendShot(fee)) {
      toast({
        variant: "destructive",
        title: "Not enough Shots!",
        description: `You need ${fee} Shots to create this challenge.`,
      });
      return;
    }

    onCreate(prize, fee);
    toast({
        title: "Challenge Created!",
        description: `Your ${gameType} challenge is now live.`
    })
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <PlusCircle className="mr-2" />
          Create New Challenge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Swords className="text-primary" /> Create {gameType === 'pool' ? 'Pool' : 'Chess'} Challenge
          </DialogTitle>
          <DialogDescription>
            Set the prize pool and entry fee. The winner takes the prize, and the platform takes a small cut.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="prize" className="text-right">
              Prize Pool
            </Label>
            <Input
              id="prize"
              type="number"
              value={prize}
              onChange={(e) => setPrize(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fee" className="text-right">
              Entry Fee
            </Label>
            <Input
              id="fee"
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex-col gap-2">
            <p className="text-sm text-muted-foreground text-center">Your entry fee of <span className="font-bold">{fee} Shots</span> will be deducted from your balance upon creation.</p>
          <Button type="submit" onClick={handleCreate}>Create Challenge</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
