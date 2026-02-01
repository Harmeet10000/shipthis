import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function DarkModeDemo() {
    const { theme } = useTheme()

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Dark Mode Demo</CardTitle>
                    <CardDescription>This component demonstrates how the dark mode theming works across different UI elements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span>Current theme:</span>
                        <Badge variant="secondary">{theme}</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Light Elements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="default"
                                    className="mr-2">
                                    Primary
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="mr-2">
                                    Secondary
                                </Button>
                                <Button variant="outline">Outline</Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Dark Elements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant="destructive"
                                    className="mr-2">
                                    Destructive
                                </Button>
                                <Button
                                    variant="ghost"
                                    className="mr-2">
                                    Ghost
                                </Button>
                                <Button variant="link">Link</Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="p-4 border rounded-lg">
                        <p className="text-foreground">This text uses the foreground color</p>
                        <p className="text-muted-foreground">This text uses the muted foreground color</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
