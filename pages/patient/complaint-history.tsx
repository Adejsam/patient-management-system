import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import PatientLayout from '../../shared/layout/PatientLayout';
import { Button } from '../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import Seo from '../../shared/seo/seo';
import Header from '../components/headers/Header';

// Type definitions
type ComplaintStatus = 'replied' | 'unreplied';

interface ComplaintResponse {
  id: string;
  responseDate: string;
  message: string;
}

interface Complaint {
  id: string;
  complaintType: string;
  department: string;
  subject: string;
  description: string;
  incidentDate: string;
  submittedDate: string;
  status: ComplaintStatus;
  responses: ComplaintResponse[];
}

export default function ComplaintHistory() {
  useTheme();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchComplaints();
  }, []);

  if (!isMounted) {
    return null;
  }

  // Function to fetch complaints from API
  async function fetchComplaints() {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/patient/complaints');
      // const data = await response.json();
      // setComplaints(data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockComplaints: Complaint[] = [
          {
            id: '1',
            complaintType: 'service',
            department: 'outpatient',
            subject: 'Long waiting time at reception',
            description: 'I had to wait for over 2 hours despite having an appointment.',
            incidentDate: '2023-05-15',
            submittedDate: '2023-05-16',
            status: 'replied',
            responses: [
              {
                id: 'r1',
                responseDate: '2023-05-18',
                message: 'We apologize for the inconvenience caused. We are implementing a new appointment system to reduce waiting times. Thank you for your feedback which helps us improve our services.'
              }
            ]
          },
          {
            id: '2',
            complaintType: 'billing',
            department: 'billing',
            subject: 'Incorrect charges on my bill',
            description: 'I was charged for services I did not receive during my last visit.',
            incidentDate: '2023-06-10',
            submittedDate: '2023-06-12',
            status: 'unreplied',
            responses: [
              
            ]
          },
        ];
        
        setComplaints(mockComplaints);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Error', {
        description: 'Failed to load complaint history. Please try again later.',
      });
      setIsLoading(false);
    }
  }

  // Function to get status badge color
  function getStatusBadgeColor(status: ComplaintStatus) {
    switch (status) {
      case 'replied':
        return 'bg-green-500 hover:bg-green-600';
      case 'unreplied':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  }

  // Function to format date
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Function to get complaint type display name
  function getComplaintTypeDisplay(type: string) {
    const types: Record<string, string> = {
      'service': 'Service Quality',
      'staff': 'Staff Behavior',
      'facility': 'Facility Issues',
      'billing': 'Billing Problems',
      'other': 'Other'
    };
    return types[type] || type;
  }

  // Function to get department display name
  function getDepartmentDisplay(dept: string) {
    const departments: Record<string, string> = {
      'emergency': 'Emergency',
      'outpatient': 'Receptionist',
      'pharmacy': 'Pharmacy',
      'laboratory': 'Laboratory',
      'billing': 'Billing',
      'other': 'Other'
    };
    return departments[dept] || dept;
  }

  return (
    <>
    <PatientLayout>
      <Seo title='Complaint History'></Seo>
      <Header title="Complaint History" breadcrumbLinkText="Home" breadcrumbLinkHref="/" />
      <div className="min-h-[100vh] rounded-xl bg-muted/50 relative w-[97%] mx-auto mb-5">
        <h1 className="text-3xl font-bold pt-7 mb-2 pl-4">
          Your <span className="text-primary">Complaint History</span>
        </h1>
        <h2 className="text-lg placeholder-opacity-80 pl-4 mb-7 tracking-tight">
          View All your Complaint History 
        </h2>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          )}
          
          {/* No complaints state */}
          {!isLoading && complaints.length === 0 && (
            <Card className="w-full">
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No complaints found</h3>
                  <p className="text-muted-foreground mb-6">
                    You haven&apos;t submitted any complaints yet.
                  </p>
                  <Button onClick={() => window.location.href = '/patient/complaints/new'}>
                    Submit a Complaint
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Complaints list */}
          {!isLoading && complaints.length > 0 && (
            <div className="space-y-6 px-4">
              <Accordion type="single" collapsible className="w-full">
                {complaints.map((complaint) => (
                  <AccordionItem key={complaint.id} value={complaint.id}>
                    <Card className="mb-4">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{complaint.subject}</CardTitle>
                            <CardDescription className="mt-1">
                              {getComplaintTypeDisplay(complaint.complaintType)} • {getDepartmentDisplay(complaint.department)}
                            </CardDescription>
                          </div>
                          <Badge className={getStatusBadgeColor(complaint.status)}>
                            {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('-', ' ')}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <AccordionTrigger className="px-6">
                        <span className="sr-only">Toggle details</span>
                      </AccordionTrigger>
                      
                      <AccordionContent>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Incident Date</h4>
                              <p>{formatDate(complaint.incidentDate)}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                              <p className="whitespace-pre-line">{complaint.description}</p>
                            </div>
                            
                            <div>
                              <h4 className="text-sm font-medium text-muted-foreground mb-1">Submitted On</h4>
                              <p>{formatDate(complaint.submittedDate)}</p>
                            </div>
                            
                            {/* Responses section */}
                            <div className="mt-6">
                              <h4 className="text-lg font-semibold mb-3">Responses</h4>
                              
                              {complaint.responses.length === 0 ? (
                                <div className="bg-muted p-4 rounded-md">
                                  <p className="text-muted-foreground">No responses yet. We&apos;ll notify you when there&apos;s an update.</p>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {complaint.responses.map((response) => (
                                    <div key={response.id} className="bg-muted p-4 rounded-md">
                                      <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-muted-foreground">{formatDate(response.responseDate)}</p>
                                      </div>
                                      <p className="whitespace-pre-line">{response.message}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter>
                        </CardFooter>
                      </AccordionContent>
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
          
          {/* New complaint button */}
          <div className="mt-8 flex justify-center">
            <Button onClick={() => window.location.href = '/patient/lodge-complaint'}>
              Submit New Complaint
            </Button>
          </div>
        </div>
      </PatientLayout>
    </>
  );
}