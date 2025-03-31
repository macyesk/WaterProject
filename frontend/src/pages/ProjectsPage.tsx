import { useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import ProjectList from '../components/ProjectList';
import WelcomeBand from '../components/WelcomeBand';
import CartSummary from '../components/CartSummary';

function ProjectsPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  return (
    <>
      <div className="container">
        <CartSummary />
        <WelcomeBand />

        <div className="row">
          <div className="col-4">
            <CategoryFilter
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>
          <div className="col-8">
            <ProjectList selectedCategories={selectedCategories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProjectsPage;
