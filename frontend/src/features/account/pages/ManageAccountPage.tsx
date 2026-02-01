import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { TwoFASection } from '../components/TwoFASection'
import { DeviceManagement } from '../components/DeviceManagement'
import { ForceLogoutSection } from '../components/ForceLogoutSection'
import { PersonalInfoForm } from '../components/PersonalInfoForm'
import { AvatarUploader } from '../components/AvatarUploader'
import { AccountStatusCard } from '../components/AccountStatusCard'
import { RequireAuthSection } from '@/features/auth/components/RequireAuthSection'

export function ManageAccountPage() {
  return (
    <RequireAuthSection>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Manage Account</h1>
          <p className="text-muted-foreground">Update your profile, security, and session preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="status">Status</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Basic contact and profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <PersonalInfoForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
                <CardDescription>Upload, crop, and resize your avatar</CardDescription>
              </CardHeader>
              <CardContent>
                <AvatarUploader />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <ChangePasswordForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <TwoFASection />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Management</CardTitle>
                <CardDescription>Active sessions and device sign-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceManagement />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Force Logout</CardTitle>
                <CardDescription>Sign out from this device and other sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <ForceLogoutSection />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <AccountStatusCard />
          </TabsContent>
        </Tabs>
      </div>
    </RequireAuthSection>
  )
}
