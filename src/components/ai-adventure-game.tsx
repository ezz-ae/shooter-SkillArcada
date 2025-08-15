
"use client";

import { useEffect, useState } from 'react';
import { generateStoryAdventure, StoryAdventureOutput } from '@/ai/flows/story-adventure-flow';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { Sparkles, FileText, ImageIcon } from 'lucide-react';
import { useNotificationStore } from '@/lib/notification-store';
import { useStore } from '@/lib/store';
import { generateProductImage } from '@/ai/flows/generate-product-image-flow';

interface AIAdventureGameProps {
    productName: string;
}

export function AIAdventureGame({ productName }: AIAdventureGameProps) {
    const [story, setStory] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [storyConclusion, setStoryConclusion] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const { add: toast } = useNotificationStore();
    const { addShots } = useStore();
    const [imageFailed, setImageFailed] = useState(false);

    useEffect(() => {
        async function getAdventure() {
            try {
                setLoading(true);
                setImageFailed(false);
                const [storyResult, imageResult] = await Promise.all([
                    generateStoryAdventure({ productName }),
                    generateProductImage({ productName, dataAiHint: "fantasy adventure" })
                ]);

                if (storyResult.story) {
                    setStory(storyResult.story);
                } else {
                     throw new Error('Failed to generate story.');
                }

                if (imageResult.imageUrl && !imageResult.imageUrl.includes('placehold.co')) {
                    setImageUrl(imageResult.imageUrl);
                } else {
                    setImageFailed(true);
                }

            } catch (error) {
                console.error("Failed to generate adventure:", error);
                toast({
                    variant: "destructive",
                    title: "Generation Failed",
                    description: "Could not generate the AI adventure. Please try refreshing the page."
                });
                setStory("A golden key lies on an ancient pedestal, humming with a faint magical energy. You reach out to touch it, and as your fingers make contact, the world around you dissolves into a swirl of colors. What secrets will it unlock?");
                setImageFailed(true);
            } finally {
                setLoading(false);
            }
        }
        getAdventure();
    }, [productName, toast]);

    const handleSubmit = () => {
        if (storyConclusion.length < 50) {
            toast({
                variant: "destructive",
                title: "Story Too Short",
                description: "Your conclusion needs to be at least 50 characters long.",
            });
            return;
        }
        setSubmitted(true);
        addShots(25); // Reward for completing
        toast({
            title: "Adventure Complete!",
            description: "A fantastic conclusion! You've been awarded 25 Shots for your creativity."
        });
    };

    if (loading) {
        return (
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="w-full h-80 rounded-lg" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                </CardContent>
                <CardFooter>
                    <div className="w-full space-y-2">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-11 w-full" />
                    </div>
                </CardFooter>
            </Card>
        );
    }

    if (!story) {
        return (
             <Card className="w-full max-w-2xl mx-auto text-center">
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                </CardHeader>
                 <CardContent>
                    <p className="text-destructive">Could not load the adventure. Please try again later.</p>
                </CardContent>
             </Card>
        )
    }

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-2xl border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="text-primary" />
                    Continue the Story
                </CardTitle>
                <CardDescription>
                    The AI has started a story and created an image. It's up to you to write the perfect ending.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative h-80 w-full overflow-hidden rounded-lg border shadow-inner">
                    {imageFailed ? (
                         <div className="w-full h-full bg-secondary flex flex-col items-center justify-center text-muted-foreground gap-2">
                            <ImageIcon className="h-12 w-12" />
                            <p className="font-semibold">Image Generation Failed</p>
                        </div>
                    ) : (
                        <Image
                            src={imageUrl}
                            alt="AI-generated adventure scene"
                            fill
                            className="object-cover"
                            data-ai-hint="fantasy adventure"
                        />
                    )}
                </div>
                <blockquote className="border-l-4 border-accent pl-4 italic text-muted-foreground">
                    {story}
                </blockquote>
                
                {submitted ? (
                     <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-center">
                        <p className="font-bold text-green-700 dark:text-green-400">Thank you for your submission! You've earned a reward.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <label htmlFor="conclusion" className="font-semibold flex items-center gap-2">
                            <FileText className="h-5 w-5"/>
                            Write Your Conclusion
                        </label>
                        <Textarea
                            id="conclusion"
                            value={storyConclusion}
                            onChange={(e) => setStoryConclusion(e.target.value)}
                            placeholder="What happens next...?"
                            rows={5}
                            className="text-base"
                            disabled={submitted}
                        />
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={submitted || storyConclusion.length < 10}
                >
                    {submitted ? "Completed!" : "Submit Story & Win Prize"}
                </Button>
            </CardFooter>
        </Card>
    );
}
