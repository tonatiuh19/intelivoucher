import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  LoadingMask,
  FullPageLoading,
  InlineLoading,
  GlobalLoadingMask,
  useLoading,
  type LoadingVariant,
  type LoadingSize,
} from "@/components/ui/loading-mask";

const LoadingDemo: React.FC = () => {
  const [variant, setVariant] = useState<LoadingVariant>("spinner");
  const [size, setSize] = useState<LoadingSize>("md");
  const [text, setText] = useState("Loading...");
  const [overlay, setOverlay] = useState([80]);
  const [blur, setBlur] = useState(false);
  const [showText, setShowText] = useState(true);

  const { isLoading, startLoading, stopLoading } = useLoading();
  const {
    isLoading: fullPageLoading,
    startLoading: startFullPage,
    stopLoading: stopFullPage,
  } = useLoading();

  const {
    isLoading: globalLoading,
    startLoading: startGlobal,
    stopLoading: stopGlobal,
  } = useLoading();

  const variants: LoadingVariant[] = [
    "spinner",
    "pulse",
    "bounce",
    "rotate",
    "compass",
    "zap",
  ];
  const sizes: LoadingSize[] = ["sm", "md", "lg", "xl"];

  const handleStartLoading = () => {
    startLoading();
    setTimeout(stopLoading, 3000); // Auto-stop after 3 seconds
  };

  const handleStartFullPage = () => {
    startFullPage();
    setTimeout(stopFullPage, 2000); // Auto-stop after 2 seconds
  };

  const handleStartGlobal = () => {
    startGlobal();
    setTimeout(stopGlobal, 2500); // Auto-stop after 2.5 seconds
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Loading Mask Component Demo</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Interactive demonstration of the LoadingMask component with various
          animations
        </p>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Controls</CardTitle>
          <CardDescription>
            Customize the loading mask appearance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Variant Selection */}
            <div className="space-y-2">
              <Label>Animation Variant</Label>
              <Select
                value={variant}
                onValueChange={(value) => setVariant(value as LoadingVariant)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variants.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v.charAt(0).toUpperCase() + v.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label>Size</Label>
              <Select
                value={size}
                onValueChange={(value) => setSize(value as LoadingSize)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Overlay Opacity */}
            <div className="space-y-2">
              <Label>Overlay Opacity: {overlay[0]}%</Label>
              <Slider
                value={overlay}
                onValueChange={setOverlay}
                max={100}
                min={0}
                step={10}
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Show Text Toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                id="show-text"
                checked={showText}
                onCheckedChange={setShowText}
              />
              <Label htmlFor="show-text">Show loading text</Label>
            </div>

            {/* Blur Background Toggle */}
            <div className="flex items-center space-x-2">
              <Switch id="blur-bg" checked={blur} onCheckedChange={setBlur} />
              <Label htmlFor="blur-bg">Blur background content</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleStartLoading} disabled={isLoading}>
              Test Loading Overlay
            </Button>
            <Button
              onClick={handleStartFullPage}
              disabled={fullPageLoading}
              variant="outline"
            >
              Test Full Page Loading
            </Button>
            <Button
              onClick={handleStartGlobal}
              disabled={globalLoading}
              variant="secondary"
            >
              Test Global Loading (Portal)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overlay Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Content with Loading Overlay</CardTitle>
            <CardDescription>
              Loading mask overlaying existing content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingMask
              isLoading={isLoading}
              variant={variant}
              size={size}
              text={showText ? text : undefined}
              overlay={overlay[0]}
              blur={blur}
            >
              <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-[200px]">
                <h3 className="text-lg font-semibold">Sample Content</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  This is some sample content that will be overlaid with the
                  loading mask when active. The content can be blurred and the
                  overlay opacity can be adjusted.
                </p>
                <div className="flex gap-2">
                  <Badge variant="secondary">Feature 1</Badge>
                  <Badge variant="secondary">Feature 2</Badge>
                  <Badge variant="secondary">Feature 3</Badge>
                </div>
                <Button variant="outline" disabled={isLoading}>
                  Sample Button
                </Button>
              </div>
            </LoadingMask>
          </CardContent>
        </Card>

        {/* Inline Loading Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Loading Variants</CardTitle>
            <CardDescription>
              Different animation styles without overlay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {variants.map((v) => (
              <div
                key={v}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <span className="font-medium capitalize">{v}</span>
                  <p className="text-sm text-gray-500">Animation variant</p>
                </div>
                <InlineLoading variant={v} size="md" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            Code examples for different scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-semibold">Basic Usage</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
              {`import { LoadingMask, useLoading } from '@/components/ui/loading-mask';

const { isLoading, startLoading, stopLoading } = useLoading();

<LoadingMask
  isLoading={isLoading}
  variant="spinner"
  size="md"
  text="Loading..."
>
  <YourContent />
</LoadingMask>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Full Page Loading</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
              {`import { FullPageLoading } from '@/components/ui/loading-mask';

<FullPageLoading
  variant="compass"
  size="lg"
  text="Initializing application..."
/>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Inline Loading</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
              {`import { InlineLoading } from '@/components/ui/loading-mask';

<InlineLoading
  variant="bounce"
  size="sm"
  text="Processing..."
/>`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold">Global Portal Loading</h4>
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-sm overflow-x-auto">
              {`import { GlobalLoadingMask } from '@/components/ui/loading-mask';

<GlobalLoadingMask
  isLoading={isLoading}
  variant="zap"
  size="xl"
  text="Loading above everything!"
/>`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Full Page Loading Demo */}
      {fullPageLoading && (
        <FullPageLoading
          variant="compass"
          size="lg"
          text="Loading full page demo..."
        />
      )}

      {/* Global Loading Demo - rendered in portal */}
      <GlobalLoadingMask
        isLoading={globalLoading}
        variant="zap"
        size="xl"
        text="Global portal loading - appears above everything!"
      />
    </div>
  );
};

export default LoadingDemo;
