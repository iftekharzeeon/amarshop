-- Create products table
CREATE TABLE public.products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    original_price DECIMAL(10, 2),
    image_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    rating INTEGER NOT NULL DEFAULT 5 CHECK (
        rating >= 1
        AND rating <= 5
    ),
    in_stock BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT now (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT now ()
);

-- Create employees table
CREATE TABLE public.employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT now (),
        updated_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT now ()
);

-- Create OTP sessions table for employee verification
CREATE TABLE public.otp_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid () PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL REFERENCES public.employees (employee_id),
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL,
        verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP
    WITH
        TIME ZONE NOT NULL DEFAULT now ()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.otp_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for products (allow everyone to read)
CREATE POLICY "Anyone can view products" ON public.products FOR
SELECT USING (true);

-- Create policies for employees (only allow reading for verification)
CREATE POLICY "Anyone can verify employee existence" ON public.employees FOR
SELECT USING (true);

-- Create policies for OTP sessions (allow creation and reading for verification)
CREATE POLICY "Anyone can create OTP sessions" ON public.otp_sessions FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Anyone can read OTP sessions for verification" ON public.otp_sessions FOR
SELECT USING (true);

CREATE POLICY "Anyone can update OTP sessions for verification" ON public.otp_sessions FOR
UPDATE USING (true);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
BEFORE UPDATE ON public.employees
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products data
INSERT INTO
    public.products (
        name,
        price,
        original_price,
        image_url,
        category,
        rating,
        in_stock
    )
VALUES (
        'Premium Wireless Earbuds',
        13999.00,
        19999.00,
        '/src/assets/earbuds.jpg',
        'Audio',
        5,
        true
    ),
    (
        'Flagship Smartphone',
        89999.00,
        99999.00,
        '/src/assets/phone.jpg',
        'Electronics',
        5,
        true
    ),
    (
        'Ultra-Thin Laptop',
        129999.00,
        NULL,
        '/src/assets/laptop.jpg',
        'Computers',
        4,
        true
    ),
    (
        'Bluetooth Speaker',
        7999.00,
        9999.00,
        '/src/assets/speaker.jpg',
        'Audio',
        4,
        false
    );

-- Insert sample employee data with Bangladesh names
INSERT INTO
    public.employees (
        employee_id,
        full_name,
        email,
        phone,
        department,
        designation
    )
VALUES (
        'EMP001',
        'আহমেদ হাসান',
        'ahmed.hasan@company.com',
        '+8801712345678',
        'IT',
        'Senior Software Engineer'
    ),
    (
        'EMP002',
        'ফাতিমা খাতুন',
        'fatima.khatun@company.com',
        '+8801823456789',
        'HR',
        'HR Manager'
    ),
    (
        'EMP003',
        'মোহাম্মদ করিম',
        'mohammad.karim@company.com',
        '+8801934567890',
        'Sales',
        'Sales Executive'
    ),
    (
        'EMP004',
        'রহিমা বেগম',
        'rahima.begum@company.com',
        '+8801645678901',
        'Finance',
        'Accountant'
    ),
    (
        'EMP005',
        'তানভীর রহমান',
        'tanvir.rahman@company.com',
        '+8801756789012',
        'IT',
        'Junior Developer'
    ),
    (
        'EMP006',
        'সালমা আক্তার',
        'salma.akter@company.com',
        '+8801867890123',
        'Marketing',
        'Marketing Coordinator'
    ),
    (
        'EMP007',
        'রফিকুল ইসলাম',
        'rafiqul.islam@company.com',
        '+8801978901234',
        'Operations',
        'Operations Manager'
    ),
    (
        'EMP008',
        'নাসরিন সুলতানা',
        'nasrin.sultana@company.com',
        '+8801589012345',
        'Customer Service',
        'Customer Support'
    ),
    (
        'EMP009',
        'জাহিদ হোসেন',
        'zahid.hossain@company.com',
        '+8801690123456',
        'IT',
        'System Administrator'
    ),
    (
        'EMP010',
        'রাহেলা পারভীন',
        'rahela.parvin@company.com',
        '+8801501234567',
        'HR',
        'HR Assistant'
    );

-- Create index for faster lookups
CREATE INDEX idx_products_category ON public.products (category);

CREATE INDEX idx_products_in_stock ON public.products (in_stock);

CREATE INDEX idx_employees_employee_id ON public.employees (employee_id);

CREATE INDEX idx_otp_sessions_employee_id ON public.otp_sessions (employee_id);

CREATE INDEX idx_otp_sessions_expires_at ON public.otp_sessions (expires_at);