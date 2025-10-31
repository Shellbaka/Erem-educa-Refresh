import { Settings, Type, Eye, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { useAccessibleToast } from "@/hooks/useAccessibleToast";

export const AccessibilityBar = () => {
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const { showAccessibleToast } = useAccessibleToast();

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem("sounds-enabled", soundsEnabled.toString());
  }, [soundsEnabled]);

  const handleSoundsToggle = (enabled: boolean) => {
    setSoundsEnabled(enabled);
    if (enabled) {
      showAccessibleToast({
        title: "Sons ativados",
        description: "Você receberá feedback sonoro nas ações",
        type: "success",
        playSound: true,
      });
    } else {
      showAccessibleToast({
        title: "Sons desativados",
        description: "Feedback sonoro foi desativado",
        type: "info",
        playSound: false,
      });
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50"
      role="region"
      aria-label="Configurações de acessibilidade"
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg bg-card hover:bg-card-hover"
            aria-label="Abrir configurações de acessibilidade"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Acessibilidade</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste a interface às suas necessidades
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="font-size" className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Tamanho da fonte
                  </Label>
                  <span className="text-sm text-muted-foreground">{fontSize}px</span>
                </div>
                <Slider
                  id="font-size"
                  min={14}
                  max={24}
                  step={1}
                  value={[fontSize]}
                  onValueChange={(value) => setFontSize(value[0])}
                  aria-label="Ajustar tamanho da fonte"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Alto contraste
                </Label>
                <Switch
                  id="high-contrast"
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                  aria-label="Ativar alto contraste"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="dark-mode" className="flex items-center gap-2">
                  {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Modo escuro
                </Label>
                <Switch
                  id="dark-mode"
                  checked={isDark}
                  onCheckedChange={setIsDark}
                  aria-label="Alternar modo escuro"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="sounds" className="flex items-center gap-2">
                  {soundsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  Feedback sonoro
                </Label>
                <Switch
                  id="sounds"
                  checked={soundsEnabled}
                  onCheckedChange={handleSoundsToggle}
                  aria-label="Ativar ou desativar feedback sonoro"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
