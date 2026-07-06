import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useGetMyQuestionnaire, useSaveQuestionnaireStep, useSubmitQuestionnaire } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const { data: questionnaire, isLoading: isInitLoading } = useGetMyQuestionnaire();
  const saveStep = useSaveQuestionnaireStep();
  const submitQ = useSubmitQuestionnaire();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    birthDate: "",
    birthTime: "",
    birthCity: "",
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (questionnaire && !initialized.current) {
      initialized.current = true;
      if (questionnaire.status === "submitted") {
        setLocation("/questionnaire/result");
        return;
      }
      setCurrentStep(questionnaire.currentStep || 1);
      setFormData({
        birthDate: questionnaire.birthDate || "",
        birthTime: questionnaire.birthTime || "",
        birthCity: questionnaire.birthCity || "",
        question1: questionnaire.question1 || "",
        question2: questionnaire.question2 || "",
        question3: questionnaire.question3 || "",
        question4: questionnaire.question4 || "",
        question5: questionnaire.question5 || "",
      });
    }
  }, [questionnaire, setLocation]);

  const handleNext = async () => {
    try {
      await saveStep.mutateAsync({
        data: {
          step: currentStep + 1,
          ...formData
        }
      });
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast({ title: "Error saving step", variant: "destructive" });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    try {
      // First save the final step
      await saveStep.mutateAsync({
        data: {
          step: 5,
          ...formData
        }
      });
      // Then submit
      await submitQ.mutateAsync(undefined);
      setLocation("/questionnaire/result");
    } catch (error) {
      toast({ title: "Error submitting questionnaire", variant: "destructive" });
    }
  };

  if (isInitLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-4 pt-8 max-w-2xl">
          <Skeleton className="h-8 w-full mb-4 bg-muted" />
          <Skeleton className="h-64 w-full bg-muted" />
        </div>
      </Layout>
    );
  }

  const isSaving = saveStep.isPending || submitQ.isPending;
  const progress = (currentStep / 5) * 100;

  return (
    <Layout>
      <div className="container mx-auto p-4 pt-8 pb-24 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-sans font-bold text-center mb-6 text-foreground">Your Birth Chart Profile</h1>
          <Progress value={progress} className="h-2 bg-muted [&>div]:bg-primary" />
          <p className="text-center text-xs text-muted-foreground mt-2 font-medium">STEP {currentStep} OF 5</p>
        </div>

        <Card className="bg-card border-border shadow-md rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border pb-6">
            <CardTitle className="font-sans font-bold text-2xl text-foreground">
              {currentStep === 1 && "Your Arrival"}
              {currentStep === 2 && "The Exact Moment"}
              {currentStep === 3 && "The Location"}
              {currentStep === 4 && "Your Path (Part 1)"}
              {currentStep === 5 && "Your Path (Part 2)"}
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              {currentStep === 1 && "When did you enter this realm?"}
              {currentStep === 2 && "The alignment of the stars depends on precise timing."}
              {currentStep === 3 && "Where on Earth did you take your first breath?"}
              {currentStep === 4 && "Tell us about the energies flowing through your life."}
              {currentStep === 5 && "Final reflections to guide our reading."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate" className="font-semibold text-foreground">Date of Birth</Label>
                  <Input 
                    id="birthDate" 
                    type="date" 
                    className="bg-background border-border shadow-sm h-12"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthTime" className="font-semibold text-foreground">Time of Birth (if known)</Label>
                  <Input 
                    id="birthTime" 
                    type="time" 
                    className="bg-background border-border shadow-sm h-12"
                    value={formData.birthTime}
                    onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                  />
                  <p className="text-xs text-muted-foreground italic">An exact time provides the most accurate rising sign.</p>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthCity" className="font-semibold text-foreground">City of Birth</Label>
                  <Input 
                    id="birthCity" 
                    type="text" 
                    placeholder="e.g., Paris, France"
                    className="bg-background border-border shadow-sm h-12"
                    value={formData.birthCity}
                    onChange={(e) => setFormData({...formData, birthCity: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question1" className="font-semibold text-foreground">What is your primary focus or challenge right now?</Label>
                  <Textarea 
                    id="question1" 
                    rows={3}
                    className="bg-background border-border shadow-sm resize-none"
                    value={formData.question1}
                    onChange={(e) => setFormData({...formData, question1: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question2" className="font-semibold text-foreground">What do you seek from this reading?</Label>
                  <Textarea 
                    id="question2" 
                    rows={3}
                    className="bg-background border-border shadow-sm resize-none"
                    value={formData.question2}
                    onChange={(e) => setFormData({...formData, question2: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question3" className="font-semibold text-foreground">Are there any repeating patterns in your life?</Label>
                  <Textarea 
                    id="question3" 
                    rows={3}
                    className="bg-background border-border shadow-sm resize-none"
                    value={formData.question3}
                    onChange={(e) => setFormData({...formData, question3: e.target.value})}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="question4" className="font-semibold text-foreground">How do you usually process emotions?</Label>
                  <Textarea 
                    id="question4" 
                    rows={3}
                    className="bg-background border-border shadow-sm resize-none"
                    value={formData.question4}
                    onChange={(e) => setFormData({...formData, question4: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="question5" className="font-semibold text-foreground">Is there anything else the seer should know?</Label>
                  <Textarea 
                    id="question5" 
                    rows={3}
                    className="bg-background border-border shadow-sm resize-none"
                    value={formData.question5}
                    onChange={(e) => setFormData({...formData, question5: e.target.value})}
                  />
                </div>
              </div>
            )}

          </CardContent>
          <CardFooter className="flex justify-between border-t border-border pt-6 bg-muted/10">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentStep === 1 || isSaving}
              className="rounded-full px-6 font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            
            {currentStep < 5 ? (
              <Button onClick={handleNext} disabled={isSaving} className="rounded-full px-8 bg-accent text-accent-foreground font-semibold hover:bg-accent/90">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Next <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSaving} className="rounded-full px-8 bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Submit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
}