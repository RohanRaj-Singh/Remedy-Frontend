/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Calendar, MapPin, User } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SurveyDetail({ params }: Props) {
  const { id } = await params;

  const res = await fetch(`${process.env.API_BASE_URL}/api/survey/${id}/result`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch survey");
  }

  const data = await res.json();
  const surveyData = data.data;

  const completedDate = new Date(surveyData.survey.completedAt).toLocaleDateString();

  const getRiskLevel = (wrs: number) => {
    if (wrs >= 0.15) return { label: "High", variant: "destructive" as const };
    if (wrs >= 0.1) return { label: "Moderate", variant: "default" as const };
    return { label: "Low", variant: "secondary" as const };
  };

  // Calculate overall metrics
  const totalWRS = Object.values(surveyData.domainResults).reduce(
    (sum: number, domain: any) => sum + domain.totalWRS,
    0,
  );

  const totalHealthyScore = Object.values(surveyData.domainResults).reduce(
    (sum: number, domain: any) => sum + domain.healthyScore,
    0,
  );

  const averageDomainScore =
    Object.values(surveyData.domainResults).reduce(
      (sum: number, domain: any) => sum + parseFloat(domain.domainScore),
      0,
    ) / Object.keys(surveyData.domainResults).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
        <div className="md:flex-1">
          <h2 className="text-foreground font-bold md:text-3xl">Survey Response Detail</h2>
          <p className="text-muted-foreground mt-1">Completed on {completedDate}</p>
        </div>
        <Badge variant={surveyData.survey.status === "completed" ? "default" : "secondary"}>
          {surveyData.survey.status}
        </Badge>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-md md:text-xl">Participant Information</CardTitle>
          <CardDescription>Demographics and background</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 md:flex-row">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Briefcase className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Department</p>
                <p className="text-foreground font-semibold">
                  {surveyData?.survey?.user?.department || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <User className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Seniority</p>
                <p className="text-foreground font-semibold">
                  {surveyData?.survey?.user?.seniorityLevel || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <Calendar className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Age Range</p>
                <p className="text-foreground font-semibold">
                  {surveyData?.survey?.user?.age || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
                <MapPin className="text-primary h-5 w-5" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Location</p>
                <p className="text-foreground font-semibold">
                  {surveyData?.survey?.user?.location || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-md md:text-lg">Average Domain Score</CardTitle>
            <CardDescription>Overall domain performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-primary text-3xl font-bold">{averageDomainScore.toFixed(2)}%</div>
            <Progress value={averageDomainScore} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-md md:text-lg">Total WRS</CardTitle>
            <CardDescription>Weighted risk score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-3xl font-bold">{totalWRS.toFixed(2)}</div>
            <p className="text-muted-foreground mt-2 text-sm">
              {surveyData.survey.responses.length} questions answered
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-md md:text-lg">Healthy Score</CardTitle>
            <CardDescription>Overall wellbeing indicator</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-foreground text-3xl font-bold">
              {(totalHealthyScore * 100).toFixed(2)}%
            </div>
            <Progress value={totalHealthyScore * 100} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl md:text-2xl font-bold">Domain Results</h3>
        {Object.entries(surveyData.domainResults).map(([domainName, domainData]: [string, any]) => (
          <Card key={domainName} className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-md md:text-xl">{domainName}</CardTitle>
                  <CardDescription>
                    Risk Count: {domainData.riskCount} | WRS: {domainData.totalWRS.toFixed(2)}
                  </CardDescription>
                </div>
                <Badge variant={getRiskLevel(domainData.totalWRS).variant}>
                  {getRiskLevel(domainData.totalWRS).label} Risk
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm">Domain Score</p>
                    <p className="text-2xl font-bold">{domainData.domainScore}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Healthy Score</p>
                    <p className="text-2xl font-bold">
                      {(domainData.healthyScore * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
                <Progress value={parseFloat(domainData.domainScore)} className="w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Response Breakdown</CardTitle>
          <CardDescription>Individual question analysis with scores</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {surveyData.survey.responses.map((response: any, index: number) => {
            // Calculate WRS for this question
            const maxScore = response.question.options.length;
            const wrs =
              (response.score * response.question.weight) / (maxScore * response.question.weight);

            const risk = getRiskLevel(wrs);

            return (
              <div key={response._id} className="overflow-x-scroll no-scrollbar">
                {index > 0 && <Separator className="my-6" />}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <Badge variant="outline">{response.question.id}</Badge>
                        <Badge variant={risk.variant}>{risk.label} Risk</Badge>
                        <Badge variant="secondary">{response.question.domain}</Badge>
                      </div>
                      <p className="text-foreground font-medium">{response.question.question}</p>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Answer: <strong>{response.question.options[response.answerIndex]}</strong>
                      </p>
                    </div>
                    <div className="min-w-[100px] text-right">
                      <p className="text-primary text-2xl font-bold">{response.score}</p>
                      <p className="text-muted-foreground text-xs">Score</p>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Weight: {response.question.weight}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {response.question.options.map((option: string, optIndex: number) => (
                      <Badge
                        key={optIndex}
                        variant={optIndex === response.answerIndex ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
