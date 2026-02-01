import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Edit2, User, Mail, Phone, MapPin, Calendar, Save, X } from 'lucide-react'
import { useCurrentUser } from '@/features/auth/hooks/useAuth'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2).max(72),
  emailAddress: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function PersonalInfoForm() {
  // Helper to format phone data
  const formatPhoneData = (phone?: string | { internationalNumber: string }): string => {
    if (!phone) return ''
    return typeof phone === 'object' ? phone.internationalNumber : phone
  }
  const [isEditing, setIsEditing] = useState(false)
  const { data: user, isLoading } = useCurrentUser()
  
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      emailAddress: '',
      phone: '',
      address: '',
    },
  })

  // Update form when user data is loaded
  useEffect(() => {
    if (user) {
const phoneValue = formatPhoneData(user.phone || user.phoneNumber)
      form.reset({
        name: user.name || '',
        emailAddress: user.emailAddress || user.email || '',
phone: phoneValue || '',
        address: user.address || '',
      })
    }
  }, [user, form])

  const onSubmit = async (values: FormValues) => {
    try {
      // TODO: Wire to /users/me update endpoint
      console.log('Updating user profile:', values)
      alert('Profile saved (mock). Wire this to your API.')
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  const handleCancel = () => {
    // Reset form to original values
    if (user) {
      form.reset({
        name: user.name || '',
        emailAddress: user.emailAddress || user.email || '',
        phone: user.phone || user.phoneNumber || '',
        address: user.address || '',
      })
    }
    setIsEditing(false)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No user data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* User Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Manage your personal details and contact information
              </CardDescription>
            </div>
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditing ? (
            // Read-only view
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <User className="h-4 w-4" />
                    Full Name
                  </div>
                  <p className="text-sm">{user.name || 'Not provided'}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm">{user.emailAddress || user.email || 'Not provided'}</p>
                    {user.isVerified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </div>
<p className="text-sm">{formatPhoneData(user.phone || user.phoneNumber) || 'Not provided'}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    Member Since
                  </div>
                  <p className="text-sm">{formatDate(user.createdAt || user.joinedAt)}</p>
                </div>
              </div>
              
              {(user.address || user.location) && (
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    Address
                  </div>
                  <p className="text-sm">{user.address || user.location || 'Not provided'}</p>
                </div>
              )}
            </div>
          ) : (
            // Edit form
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField name="name" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField name="emailAddress" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address
                        <Badge variant="outline" className="ml-2 text-xs">
                          Locked
                        </Badge>
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="jane@example.com" 
                          disabled 
                          className="bg-muted"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <FormField name="phone" control={form.control} render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 555 123 4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  
                  <div className="md:col-span-2">
                    <FormField name="address" control={form.control} render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Main St, City, Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      {/* Additional User Info */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Account Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">User ID:</span>
                <p className="font-mono">{user.id || user._id || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  <Badge variant={user.isActive !== false ? "default" : "secondary"}>
                    {user.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">Role:</span>
                <p className="capitalize">{user.role || 'User'}</p>
              </div>
              {user.lastLoginAt && (
                <div className="md:col-span-3">
                  <span className="font-medium text-muted-foreground">Last Login:</span>
                  <p>{formatDate(user.lastLoginAt)}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
