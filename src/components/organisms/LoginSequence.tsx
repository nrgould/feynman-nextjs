// ... imports remain the same

// Add these styles to the components:

{
	/* In step 1 */
}
<Select
	value={formData.educationLevel}
	onValueChange={(value) => updateFormData('educationLevel', value)}
>
	<SelectTrigger className='border-slate-300'>
		<SelectValue placeholder='Select your education level' />
	</SelectTrigger>
	<SelectContent>{/* ... content remains the same */}</SelectContent>
</Select>;

{
	/* In step 2 */
}
<RadioGroup
	value={formData.referralSource}
	onValueChange={(value) => updateFormData('referralSource', value)}
	className='[&>div>label]:text-slate-700 [&>div>button]:border-slate-300'
>
	{/* ... content remains the same */}
</RadioGroup>;

{
	/* In step 3 */
}
<Checkbox
	id={subject.id}
	checked={formData.selectedSubjects.includes(subject.id)}
	onCheckedChange={() => handleSubjectToggle(subject.id)}
	className='border-slate-300 data-[state=checked]:border-slate-300'
/>;

{
	/* In step 4 */
}
<Input
	placeholder='Tell us what you hope to achieve...'
	value={formData.goals}
	onChange={(e) => updateFormData('goals', e.target.value)}
	className='border-slate-300'
/>;
