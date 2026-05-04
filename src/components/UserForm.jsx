const restrictionOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'dairy-free', label: 'Dairy-free' },
  { id: 'nut-free', label: 'Nut-free' },
  { id: 'gluten-free', label: 'Gluten-free' },
];

/**
 * Renders the editable user profile form.
 * Inputs: the current userProfile object and an onProfileChange callback.
 * Returns: the form UI for collecting meal-planning inputs.
 * Why it exists: separating the form keeps App focused on data flow instead of form markup.
 */
function UserForm({ userProfile, onProfileChange }) {
  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    onProfileChange({
      ...userProfile,
      [name]: ['age', 'heightInches', 'weightPounds'].includes(name) ? Number(value) : value,
    });
  };

  const handleRestrictionChange = (event) => {
    const { value, checked } = event.target;
    const nextRestrictions = checked
      ? [...userProfile.dietaryRestrictions, value]
      : userProfile.dietaryRestrictions.filter((restriction) => restriction !== value);

    onProfileChange({
      ...userProfile,
      dietaryRestrictions: nextRestrictions,
    });
  };

  const handleReset = () => {
    onProfileChange({
      age: 24,
      sex: 'female',
      heightInches: 66,
      weightPounds: 145,
      activityLevel: 'moderate',
      dietaryRestrictions: [],
    });
  };

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="section-kicker">User profile</p>
          <h2>Personalize the plan</h2>
        </div>
      </div>

      <div className="form-grid">
        <div className="input-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            min="12"
            max="100"
            name="age"
            type="number"
            value={userProfile.age}
            onChange={handleFieldChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="sex">Sex</label>
          <select id="sex" name="sex" value={userProfile.sex} onChange={handleFieldChange}>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="heightInches">Height (inches)</label>
          <input
            id="heightInches"
            min="48"
            max="84"
            name="heightInches"
            type="number"
            value={userProfile.heightInches}
            onChange={handleFieldChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="weightPounds">Weight (pounds)</label>
          <input
            id="weightPounds"
            min="80"
            max="400"
            name="weightPounds"
            type="number"
            value={userProfile.weightPounds}
            onChange={handleFieldChange}
          />
        </div>

        <div className="input-group">
          <label htmlFor="activityLevel">Activity level</label>
          <select
            id="activityLevel"
            name="activityLevel"
            value={userProfile.activityLevel}
            onChange={handleFieldChange}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
          </select>
        </div>

        <div className="input-group">
          <span className="checkbox-title">Dietary restrictions</span>
          <div className="restriction-grid">
            {restrictionOptions.map((option) => (
              <label key={option.id} className="checkbox-row">
                <input
                  checked={userProfile.dietaryRestrictions.includes(option.id)}
                  type="checkbox"
                  value={option.id}
                  onChange={handleRestrictionChange}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <p className="muted-text">
          Results update automatically as you change the profile.
        </p>

        <div className="button-row">
          <button className="secondary-button" type="button" onClick={handleReset}>
            Reset profile
          </button>
        </div>
      </div>
    </section>
  );
}

export default UserForm;
