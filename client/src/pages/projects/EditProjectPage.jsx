import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { projectService } from '@/services/api';
import { Card, CardBody, CardHeader, Button, Input, Spinner } from '@/components/ui';
import { ArrowLeft } from 'lucide-react';

const projectSchema = z.object({
  projectName: z.string().min(2, 'Project name must be at least 2 characters').optional().or(z.literal('')),
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  mobile: z.string().min(10, 'Please enter a valid mobile number'),
  email: z.string().email('Please enter a valid email'),
  industry: z.string().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  budget: z.string().optional().or(z.literal('')),
  timelineStartDate: z.string().optional().or(z.literal('')),
  timelineEndDate: z.string().optional().or(z.literal('')),
});

export default function EditProjectPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: '',
      customerName: '',
      businessName: '',
      mobile: '',
      email: '',
      industry: '',
      description: '',
      budget: '',
      timelineStartDate: '',
      timelineEndDate: '',
    },
  });

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await projectService.getProject(id);
      const project = response.data;

      reset({
        projectName: project.projectName || '',
        customerName: project.customerName || '',
        businessName: project.businessName || '',
        mobile: project.mobile || '',
        email: project.email || '',
        industry: project.industry || '',
        description: project.description || '',
        budget: project.budget?.toString() || '',
        timelineStartDate: project.timeline?.startDate ? new Date(project.timeline.startDate).toISOString().split('T')[0] : '',
        timelineEndDate: project.timeline?.endDate ? new Date(project.timeline.endDate).toISOString().split('T')[0] : '',
      });
    } catch (error) {
      toast.error(error.message || 'Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      // Transform data for API
      const projectData = {
        customerName: data.customerName,
        businessName: data.businessName,
        mobile: data.mobile,
        email: data.email,
        projectName: data.projectName || undefined,
        industry: data.industry || undefined,
        description: data.description || undefined,
        budget: data.budget ? Number(data.budget) : undefined,
        timeline: (data.timelineStartDate || data.timelineEndDate) ? {
          startDate: data.timelineStartDate ? new Date(data.timelineStartDate) : undefined,
          endDate: data.timelineEndDate ? new Date(data.timelineEndDate) : undefined,
        } : undefined,
      };

      await projectService.updateProject(id, projectData);
      toast.success('Project updated successfully!');
      navigate(`/projects/${id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => navigate(`/projects/${id}`)}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-1">
            Update project details and information.
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Project Information</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer & Business Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                placeholder="John Doe"
                error={errors.customerName?.message}
                {...register('customerName')}
              />
              <Input
                label="Business Name"
                placeholder="Acme Inc."
                error={errors.businessName?.message}
                {...register('businessName')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Project Name (Optional)"
                placeholder="e.g., Q1 Marketing Campaign"
                error={errors.projectName?.message}
                {...register('projectName')}
              />
              <Input
                label="Industry (Optional)"
                placeholder="e.g., E-commerce, SaaS, Healthcare"
                error={errors.industry?.message}
                {...register('industry')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mobile Number"
                placeholder="+1 234 567 8900"
                error={errors.mobile?.message}
                {...register('mobile')}
              />
              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
            </div>

            {/* Project Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                placeholder="Brief description of the project..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                {...register('description')}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Budget (Optional)"
                type="number"
                placeholder="5000"
                error={errors.budget?.message}
                {...register('budget')}
              />
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Timeline (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Date"
                  type="date"
                  {...register('timelineStartDate')}
                />
                <Input
                  label="End Date"
                  type="date"
                  {...register('timelineEndDate')}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/projects/${id}`)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}