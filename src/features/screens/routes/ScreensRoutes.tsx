// src/features/screens/routes/ScreensRoutes.tsx
import {Route, Routes} from 'react-router-dom';
import {ScreenListView} from '../views/ScreenListView.tsx';
import {ScreenCreateView} from '../views/ScreenCreateView.tsx';
import {ScreenEditView} from '../views/ScreenEditView.tsx';
import {ScreenDetailsView} from '../views/ScreenDetailsView.tsx';

export const ScreensRoutes = () => {
    return (
        <Routes>
            <Route index element={<ScreenListView/>}/>
            <Route path="create" element={<ScreenCreateView/>}/>
            <Route path=":id" element={<ScreenDetailsView/>}/>
            <Route path=":id/edit" element={<ScreenEditView/>}/>
        </Routes>
    );
};