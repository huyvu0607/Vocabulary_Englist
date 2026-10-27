import CourseTargetForm from '../components/CourseTargetForm.jsx';

function SettingsPage() {
  return (
    <main className="px-4 py-8">
      <div className="mx-auto max-w-xl">
        <h1 className="text-xl font-semibold text-primary">Cài đặt</h1>
        <CourseTargetForm />
      </div>
    </main>
  );
}

export default SettingsPage;
